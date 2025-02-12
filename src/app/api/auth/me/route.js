// src/app/api/auth/me/route.js
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({
        success: false,
        message: '未登入'
      }, { status: 401 });
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(authToken, secret);
      
      // 從資料庫取得使用者資訊
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { 
          id: true, 
          email: true, 
          name: true,
          faId: true
        }
      });

      if (!user) {
        throw new Error('User not found');
      }

      return NextResponse.json({
        success: true,
        user
      });

    } catch (error) {
      return NextResponse.json({
        success: false,
        message: '驗證失敗'
      }, { status: 401 });
    }

  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({
      success: false,
      message: '驗證過程發生錯誤'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}