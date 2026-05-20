-- Create storage bucket for product images
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do nothing;

-- Allow public read access to product-images bucket
create policy "product_images_public_select"
on storage.objects for select
using (bucket_id = 'product-images');

-- Allow authenticated admins to insert into product-images
create policy "product_images_admin_insert"
on storage.objects for insert
with check (
  bucket_id = 'product-images'
  and exists (
    select 1 from profiles
    where id = auth.uid() and role = 'admin'
  )
);

-- Allow authenticated admins to update in product-images
create policy "product_images_admin_update"
on storage.objects for update
using (
  bucket_id = 'product-images'
  and exists (
    select 1 from profiles
    where id = auth.uid() and role = 'admin'
  )
);

-- Allow authenticated admins to delete from product-images
create policy "product_images_admin_delete"
on storage.objects for delete
using (
  bucket_id = 'product-images'
  and exists (
    select 1 from profiles
    where id = auth.uid() and role = 'admin'
  )
);
