import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Switch } from '../components/ui/switch';
import { Calendar } from '../components/ui/calendar';

export default function SocialMediaAgent() {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [date, setDate] = useState(new Date());
  const [platforms, setPlatforms] = useState({ instagram: true, facebook: true });
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      try {
        const res = await fetch('/api/socialmedia/generate-caption', {
          method: 'POST',
          body: formData
        });

        const data = await res.json();
        setCaption(data.caption || '');
      } catch (err) {
        toast.error('Failed to generate caption');
      }
    }
  };

  const handlePost = async () => {
    if (!image) return toast.error('Please upload an image.');
    setUploading(true);

    const formData = new FormData();
    formData.append('image', image);
    formData.append('caption', caption);
    formData.append('date', date.toISOString());
    formData.append('instagram', platforms.instagram);
    formData.append('facebook', platforms.facebook);

    try {
      const res = await fetch('/api/socialmedia/schedule-post', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) throw new Error('Failed to schedule post.');
      toast.success('Post scheduled successfully!');
      setImage(null);
      setCaption('');
    } catch (err) {
      toast.error('Error scheduling post');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto mt-6 p-4">
      <CardContent className="space-y-4">
        <h2 className="text-xl font-semibold">📱 Social Media Agent</h2>

        <Input type="file" accept="image/*" onChange={handleImageUpload} />

        {image && (
          <img
            src={URL.createObjectURL(image)}
            alt="Preview"
            className="rounded-lg w-full h-auto mt-2"
          />
        )}

        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Enter or edit your caption..."
          className="resize-none h-32"
        />

        <div className="flex gap-4 items-center">
          <label className="font-medium">Post Date:</label>
          <Calendar selected={date} onSelect={setDate} mode="single" />
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <Switch
              checked={platforms.instagram}
              onCheckedChange={(v) => setPlatforms(p => ({ ...p, instagram: v }))}
            /> Instagram
          </label>
          <label className="flex items-center gap-2">
            <Switch
              checked={platforms.facebook}
              onCheckedChange={(v) => setPlatforms(p => ({ ...p, facebook: v }))}
            /> Facebook
          </label>
        </div>

        <Button onClick={handlePost} disabled={uploading} className="w-full">
          {uploading ? 'Scheduling...' : 'Schedule Post'}
        </Button>
      </CardContent>
    </Card>
  );
}
