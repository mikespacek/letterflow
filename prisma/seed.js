const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Default templates
const defaultTemplates = [
  {
    name: 'Rental Property Inquiry',
    category: 'rental',
    content: `Dear {{owner_name}},

I hope this letter finds you well. My name is {{user_name}} and I'm a real estate professional in the {{property_city}} area.

I'm writing to express my interest in your rental property at {{address}}. I have clients who are looking for investment opportunities in this area, and your property caught my attention.

If you've ever considered selling this property, I'd be happy to provide you with a free, no-obligation market analysis to determine its current value. The rental market in {{property_city}} is quite strong right now, which may make this an opportune time for you to consider your options.

Please feel free to contact me at {{user_phone}} or {{user_email}} if you'd like to discuss this further. I'd be happy to answer any questions you might have.

Thank you for your time and consideration.

Best regards,
{{user_name}}
{{user_company}}`,
    isDefault: true,
    description: 'Standard template for inquiring about rental properties'
  },
  {
    name: 'Commercial Property Offer',
    category: 'commercial',
    content: `Dear {{owner_name}},

I hope this letter finds you well. My name is {{user_name}} with {{user_company}}, and I'm writing regarding your commercial property at {{address}}.

I represent a client who has expressed serious interest in properties in the {{property_city}} area, specifically in your neighborhood. They are prepared to make a competitive offer and can close quickly if we can reach agreeable terms.

The commercial real estate market is experiencing significant shifts right now, and my client is looking to expand their portfolio before interest rates potentially increase further.

Would you be open to discussing a potential sale? I'd be happy to provide more details about my client's requirements and capabilities.

Please contact me at {{user_phone}} or via email at {{user_email}} at your earliest convenience.

I look forward to the possibility of working with you.

Sincerely,
{{user_name}}
{{user_company}}`,
    isDefault: true,
    description: 'Professional template for commercial property offers'
  },
  {
    name: 'Vacant Land Development Proposal',
    category: 'land',
    content: `Dear {{owner_name}},

I'm writing regarding your vacant land at {{address}}. My name is {{user_name}}, a real estate professional with {{user_company}} specializing in land development opportunities.

I've been researching potential development sites in {{property_city}}, and your property has qualities that align perfectly with what developers are currently seeking. The location, zoning, and characteristics of your land present exceptional potential for development.

I have connections with several developers who are actively looking for land similar to yours. If you've ever considered selling, I would be pleased to discuss how I might help you maximize the value of your property.

The current market for developable land is particularly strong, making this potentially an ideal time to explore your options.

I would welcome the opportunity to discuss this with you further. Please feel free to contact me at {{user_phone}} or {{user_email}}.

Respectfully,
{{user_name}}
{{user_company}}`,
    isDefault: true,
    description: 'Template for approaching owners of vacant land'
  }
];

async function main() {
  console.log(`Start seeding ...`);
  
  // First, create a system user if it doesn't exist
  let systemUser = await prisma.user.findUnique({
    where: { id: 'system' }
  });
  
  if (!systemUser) {
    systemUser = await prisma.user.create({
      data: {
        id: 'system',
        email: 'system@example.com',
        name: 'System',
        password: 'not-applicable',
        plan: 'pro' // System has all capabilities
      }
    });
    console.log('Created system user');
  }
  
  // Create default templates
  for (const template of defaultTemplates) {
    const existing = await prisma.template.findFirst({
      where: {
        name: template.name,
        isDefault: true
      }
    });
    
    if (!existing) {
      await prisma.template.create({
        data: {
          ...template,
          userId: systemUser.id, // Use the system user's ID
        }
      });
      console.log(`Created default template: ${template.name}`);
    } else {
      console.log(`Default template already exists: ${template.name}`);
    }
  }
  
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }); 