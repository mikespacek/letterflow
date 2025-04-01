import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Temporary mock user ID until we implement authentication
const MOCK_USER_ID = 'cluser123456789';

// Create a new user if it doesn't exist yet (for development purposes)
async function ensureUserExists() {
  const existingUser = await prisma.user.findUnique({
    where: { id: MOCK_USER_ID }
  });

  if (!existingUser) {
    return prisma.user.create({
      data: {
        id: MOCK_USER_ID,
        email: 'demo@example.com',
        name: 'Demo User',
        password: 'not-a-real-password-yet',
        plan: 'starter' // Give them starter to test functionality
      }
    });
  }

  return existingUser;
}

// GET /api/user - Get the current user's information
export async function GET() {
  try {
    const user = await ensureUserExists();
    
    // Don't return the password
    const { password, ...safeUser } = user;
    
    // Determine capabilities based on the plan
    const capabilities = {
      maxUploads: user.plan === 'free' ? 1 : user.plan === 'starter' ? 5 : Infinity, // Unlimited for Pro
      canSaveNeighborhoods: user.plan !== 'free',
      canExportExcel: user.plan !== 'free',
      canExportNumbers: user.plan !== 'free',
      canUseAI: user.plan === 'pro',
      canCustomizeBranding: user.plan === 'pro',
      canAutoSendLetters: user.plan === 'pro',
      canBulkSendLetters: user.plan === 'pro',
      hasAdvancedAnalytics: user.plan === 'pro'
    };
    
    // Calculate when the subscription renews (mocked for now)
    let renewalDate = null;
    if (user.renewalDate) {
      renewalDate = user.renewalDate.toISOString().split('T')[0];
    }
    
    // Calculate days left in subscription (mocked for now)
    const daysLeft = 30; // Placeholder
    
    // For Pro users with unlimited uploads, display a special value
    const uploadsTotal = capabilities.maxUploads === Infinity ? 'unlimited' : capabilities.maxUploads;
    
    return NextResponse.json({
      user: safeUser,
      capabilities,
      subscription: {
        plan: user.plan,
        uploadsUsed: user.uploadsUsed,
        uploadsTotal: uploadsTotal,
        daysLeft,
        renewalDate,
        isExpiring: daysLeft < 7
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data', details: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/user - Update user's upload count
export async function PATCH(request) {
  try {
    const user = await ensureUserExists();
    const { incrementUploads } = await request.json();
    
    if (incrementUploads) {
      // Only increment upload count if not Pro plan (since Pro has unlimited)
      if (user.plan !== 'pro') {
        const updatedUser = await prisma.user.update({
          where: { id: user.id },
          data: { uploadsUsed: { increment: 1 } }
        });
        
        // Don't return the password
        const { password, ...safeUser } = updatedUser;
        
        return NextResponse.json({
          success: true,
          user: safeUser,
          uploadsUsed: updatedUser.uploadsUsed
        });
      } else {
        // For Pro users, we still track uploads for analytics but don't limit them
        const updatedUser = await prisma.user.update({
          where: { id: user.id },
          data: { uploadsUsed: { increment: 1 } }
        });
        
        // Don't return the password
        const { password, ...safeUser } = updatedUser;
        
        return NextResponse.json({
          success: true,
          user: safeUser,
          uploadsUsed: updatedUser.uploadsUsed,
          uploadsTotal: 'unlimited'
        });
      }
    }
    
    return NextResponse.json({ error: 'No update action specified' }, { status: 400 });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user data', details: error.message },
      { status: 500 }
    );
  }
} 