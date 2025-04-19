import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { CustomJwtPayload } from '../types/express.js';
import { Role } from '@prisma/client';

// Middleware untuk memverifikasi token JWT
export async function VerifyToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    // Mengambil token dari cookies
    const token = req.cookies.token; // Ambil token dari cookies

    if (!token) {
      res.status(401).json({ message: 'No token provided' });
      return; // Hentikan eksekusi fungsi jika tidak ada token
    }

    // Verifikasi token menggunakan secret key dari env
    const verifiedUser = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string, // Secret key yang digunakan saat membuat JWT
    ) as CustomJwtPayload; // Menyatakan bahwa token yang terverifikasi memiliki tipe CustomJwtPayload

    // Simpan data user yang sudah terverifikasi dalam request object
    req.user = verifiedUser; // Payload akan menyertakan data user (id, role)

    next(); // Lanjutkan ke middleware atau handler berikutnya
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ message: 'Token verification failed' });
  }
}

// Middleware untuk memeriksa apakah user adalah Super Admin atau Store Admin
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userRole = req.user?.role; // Ambil role dari request object

  if (
    !userRole ||
    (userRole !== Role.SUPER_ADMIN && userRole !== Role.STORE_ADMIN)
  ) {
    res.status(403).json({ message: 'Forbidden: User is not authorized' });
    return; // Hentikan eksekusi fungsi
  }

  next(); // Lanjutkan ke middleware atau handler berikutnya
}

// Middleware untuk memeriksa apakah user adalah Super Admin
export function superAdminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userRole = req.user?.role; // Ambil role dari request object

  if (!userRole || userRole !== Role.SUPER_ADMIN) {
    res.status(403).json({ message: 'Forbidden: User is not a super admin' });
    return; // Hentikan eksekusi fungsi
  }

  next(); // Lanjutkan ke middleware atau handler berikutnya
}
