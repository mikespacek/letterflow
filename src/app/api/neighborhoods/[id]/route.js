import { NextResponse } from 'next/server';
import { getNeighborhoodById, updateNeighborhood, deleteNeighborhood } from '@/services/neighborhoodService';

// Temporary mock user ID until we implement authentication
const MOCK_USER_ID = 'cluser123456789';

// GET /api/neighborhoods/[id] - Get a specific neighborhood by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Neighborhood ID is required' },
        { status: 400 }
      );
    }
    
    const neighborhood = await getNeighborhoodById(id);
    return NextResponse.json(neighborhood);
  } catch (error) {
    console.error(`Error fetching neighborhood ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch neighborhood', message: error.message },
      { status: 404 }
    );
  }
}

// PUT /api/neighborhoods/[id] - Update a neighborhood
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Neighborhood ID is required' },
        { status: 400 }
      );
    }
    
    const neighborhood = await updateNeighborhood(id, data);
    return NextResponse.json(neighborhood);
  } catch (error) {
    console.error(`Error updating neighborhood ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update neighborhood', message: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/neighborhoods/[id] - Delete a neighborhood
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Neighborhood ID is required' },
        { status: 400 }
      );
    }
    
    await deleteNeighborhood(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting neighborhood ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete neighborhood', message: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/neighborhoods/[id] - Update a neighborhood 
export async function PATCH(request, { params }) {
  const { id } = params;
  const updates = await request.json();

  try {
    // Check if the neighborhood exists and belongs to the user
    const neighborhood = await prisma.neighborhood.findFirst({
      where: {
        id: id,
        userId: MOCK_USER_ID
      }
    });

    if (!neighborhood) {
      return NextResponse.json(
        { error: 'Neighborhood not found or access denied' },
        { status: 404 }
      );
    }

    // Update allowed fields
    const updatedNeighborhood = await prisma.neighborhood.update({
      where: {
        id: id
      },
      data: {
        name: updates.name !== undefined ? updates.name : undefined,
        description: updates.description !== undefined ? updates.description : undefined,
      }
    });

    return NextResponse.json({ 
      success: true, 
      neighborhood: updatedNeighborhood 
    });
  } catch (error) {
    console.error('Error updating neighborhood:', error);
    return NextResponse.json(
      { error: 'Failed to update neighborhood', details: error.message },
      { status: 500 }
    );
  }
} 