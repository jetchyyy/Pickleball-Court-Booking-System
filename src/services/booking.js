import { supabase } from '../lib/supabaseClient';

// Upload proof of payment image
export async function uploadProofOfPayment(file, bookingId) {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${bookingId}-${Date.now()}.${fileExt}`;
    const filePath = `booking-proofs/${fileName}`;

    const { error: uploadError, data: uploadData } = await supabase.storage
      .from('booking-proofs')
      .upload(filePath, file);

    if (uploadError) {
      throw new Error(`Failed to upload proof of payment: ${uploadError.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('booking-proofs')
      .getPublicUrl(filePath);

    const publicUrl = urlData?.publicUrl;

    return publicUrl;
  } catch (err) {
    throw err;
  }
}

// Get bookings for a court on a specific date
export async function getCourtBookings(courtId, date) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('court_id', courtId)
    .eq('booking_date', date)
    .eq('status', 'Confirmed');
  
  if (error) {
    return [];
  }
  
  return data;
}

// Create booking
export async function createBooking({
  courtId,
  customerName,
  customerEmail,
  customerPhone,
  bookingDate,
  startTime,
  endTime,
  totalPrice,
  notes,
  proofOfPaymentUrl
}) {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert([{
        court_id: courtId,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        booking_date: bookingDate,
        start_time: startTime,
        end_time: endTime,
        total_price: totalPrice || 0,
        status: 'Confirmed',
        notes: notes || '',
        proof_of_payment_url: proofOfPaymentUrl || null
      }])
      .select();
    
    if (error) {
      throw new Error(`Booking failed: ${error.message}`);
    }
    
    return data?.[0];
  } catch (err) {
    throw err;
  }
}

// Get all bookings (admin)
export async function getAllBookings() {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, courts(name, type)')
    .order('booking_date', { ascending: false });
  
  if (error) {
    return [];
  }
  
  return data;
}

// Update booking status (admin)
export async function updateBookingStatus(bookingId, status) {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', bookingId)
    .select();
  
  if (error) throw error;
  
  return data?.[0];
}

// Subscribe to bookings (real-time)
export function subscribeToBookings(callback) {
  return supabase
    .channel('bookings')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, callback)
    .subscribe();
}