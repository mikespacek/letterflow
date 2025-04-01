import { NextResponse } from 'next/server';
import { getNeighborhoods, createNeighborhood } from '@/services/neighborhoodService';

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

// GET /api/neighborhoods - Get all neighborhoods
export async function GET() {
  try {
    const neighborhoods = await getNeighborhoods();
    return NextResponse.json(neighborhoods);
  } catch (error) {
    console.error('Error fetching neighborhoods:', error);
    return NextResponse.json(
      { error: 'Failed to fetch neighborhoods' },
      { status: 500 }
    );
  }
}

// POST /api/neighborhoods - Create a new neighborhood
export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.name) {
      return NextResponse.json(
        { error: 'Neighborhood name is required' },
        { status: 400 }
      );
    }
    
    const neighborhood = await createNeighborhood(data);
    return NextResponse.json(neighborhood, { status: 201 });
  } catch (error) {
    console.error('Error creating neighborhood:', error);
    return NextResponse.json(
      { error: 'Failed to create neighborhood' },
      { status: 500 }
    );
  }
} 