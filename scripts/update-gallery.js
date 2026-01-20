
import { createClient } from '@supabase/supabase-js';

const projectId = "njxtiaokvgoaxjcrnxzo";
const publicAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qeHRpYW9rdmdvYXhqY3JueHpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MTk2OTIsImV4cCI6MjA3NTQ5NTY5Mn0.3jGkWNSTsdTaeL1h9EkRR3utKzkwXCRizuDLreDf-fs";
const supabaseUrl = `https://${projectId}.supabase.co`;

const supabase = createClient(supabaseUrl, publicAnonKey);

const newImages = [
    {
        title: 'Luxury Wedding Reception',
        image_url: '/new-gallery-images/wedding.png',
        category: 'Weddings',
        description: 'A luxurious wedding reception hall with crystal chandeliers and floral decorations.',
        is_featured: true,
    },
    {
        title: 'Corporate Conference',
        image_url: '/new-gallery-images/corporate.png',
        category: 'Corporate Events',
        description: 'Modern corporate event setup with professional lighting and seating.',
        is_featured: true,
    },
    {
        title: 'Gala Dinner',
        image_url: '/new-gallery-images/dining.png',
        category: 'Social Gatherings',
        description: 'Elegant dining arrangement for a gala dinner.',
        is_featured: true,
    },
    {
        title: 'Garden Party',
        image_url: '/new-gallery-images/outdoor.png',
        category: 'Social Gatherings',
        description: 'Beautiful outdoor garden party setup at sunset.',
        is_featured: false,
    }
];

async function updateGallery() {
    console.log('Starting gallery update...');

    // 1. Delete existing items (if allowed)
    console.log('Deleting existing gallery items...');
    const { error: deleteError } = await supabase
        .from('gallery')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError) {
        console.warn('Warning: Could not delete existing items. RLS might be blocking delete.', deleteError.message);
        // Continue gracefully - maybe we just append?
    } else {
        console.log('Existing items deleted.');
    }

    // 2. Insert new items
    console.log('Inserting new gallery items...');
    const { data, error: insertError } = await supabase
        .from('gallery')
        .insert(newImages)
        .select();

    if (insertError) {
        console.error('Error inserting new items:', insertError.message);
        process.exit(1);
    }

    console.log('Successfully inserted', data.length, 'items.');
}

updateGallery();
