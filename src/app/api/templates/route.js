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

// GET /api/templates - Get all templates for the user
export async function GET() {
  try {
    const user = await ensureUserExists();
    
    // Get default templates and user's custom templates
    const templates = await prisma.template.findMany({
      where: {
        OR: [
          { userId: user.id },
          { isDefault: true }
        ]
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/templates - Create a new template
export async function POST(request) {
  try {
    const user = await ensureUserExists();
    const { name, category, content, description } = await request.json();
    
    // Validate input
    if (!name || !category || !content) {
      return NextResponse.json(
        { error: 'Name, category, and content are required' },
        { status: 400 }
      );
    }
    
    const template = await prisma.template.create({
      data: {
        name,
        category,
        content,
        description,
        userId: user.id
      }
    });
    
    return NextResponse.json({ success: true, template }, { status: 201 });
  } catch (error) {
    console.error('Error creating template:', error);
    return NextResponse.json(
      { error: 'Failed to create template', details: error.message },
      { status: 500 }
    );
  }
} 