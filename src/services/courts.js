import { supabase } from '../lib/supabaseClient';

// Upload images to storage
export async function uploadCourtImages(files) {
  const results = [];

  for (const file of files) {
    const unique = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from('court-images')
      .upload(unique, file);

    if (error) {
      console.error('Upload error:', error);
      continue;
    }

    const { data: urlData } = supabase.storage
      .from('court-images')
      .getPublicUrl(unique);

    results.push({
      path: unique,
      url: urlData.publicUrl
    });
  }

  return results;
}

// List all courts
export async function listCourts() {
  const { data, error } = await supabase
    .from('courts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('listCourts error:', error);
    return [];
  }

  return data;
}

// Get single court with bookings
export async function getCourt(courtId) {
  const { data, error } = await supabase
    .from('courts')
    .select('*, bookings(*)')
    .eq('id', courtId)
    .single();

  if (error) {
    console.error('getCourt error:', error);
    return null;
  }

  return data;
}

// Create court (admin only)
export async function createCourt({ name, type, price, description, imageFiles, pricingRules, capacity }) {
  const images = await uploadCourtImages(Array.from(imageFiles || []));

  const { data: user } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('courts')
    .insert([{
      name,
      type,
      price,
      description,
      admin_id: user.user.id,
      images, // store array of { path, url }
      pricing_rules: pricingRules || [], // store time-based pricing rules
      capacity: Number(capacity) || 10
    }])
    .select();

  if (error) {
    console.error('createCourt error:', error);
    throw error;
  }

  return data?.[0];
}

// Update court (admin only)
export async function updateCourt(courtId, { name, type, price, description, imageFiles, pricingRules, capacity }) {
  // Upload new images if provided
  let images = undefined;
  if (imageFiles && imageFiles.length > 0) {
    images = await uploadCourtImages(Array.from(imageFiles));
  }

  const updateData = {
    name,
    type,
    price,
    description,
    capacity: Number(capacity) || 10
  };

  // Only update images if new ones were uploaded
  if (images) {
    updateData.images = images;
  }

  // Update pricing rules if provided
  if (pricingRules) {
    updateData.pricing_rules = pricingRules;
  }

  const { data, error } = await supabase
    .from('courts')
    .update(updateData)
    .eq('id', courtId)
    .select();

  if (error) {
    console.error('updateCourt error:', error);
    throw error;
  }

  return data?.[0];
}

// Toggle court active status (admin only)
export async function toggleCourtStatus(courtId, isActive) {
  const { data, error } = await supabase
    .from('courts')
    .update({ is_active: isActive })
    .eq('id', courtId)
    .select();

  if (error) {
    console.error('toggleCourtStatus error:', error);
    throw error;
  }

  return data?.[0];
}

// Delete court (admin only)
export async function deleteCourt(courtId) {
  const { data: court } = await supabase
    .from('courts')
    .select('images')
    .eq('id', courtId)
    .single();

  // Delete images from storage
  if (court?.images?.length) {
    const paths = court.images.map(img => img.path);
    await supabase.storage.from('court-images').remove(paths);
  }

  const { error } = await supabase
    .from('courts')
    .delete()
    .eq('id', courtId);

  if (error) throw error;
}

// Subscribe to court changes (real-time)
export function subscribeToCourts(callback) {
  return supabase
    .channel('courts')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'courts' }, callback)
    .subscribe();
}