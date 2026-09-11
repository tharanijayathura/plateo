import { Metadata } from 'next';
import StoryExperience from '@/components/StoryExperience/StoryExperience';
import CulinaryMastersSection from '@/components/CulinaryMastersSection/CulinaryMastersSection';

export const metadata: Metadata = {
  title: 'Our Story | The Origin & Craft of Plateo',
  description: 'From nature. Through fire. To you. Discover the culinary story, philosophy, and master chefs of Plateo.',
};

export default function AboutPage() {
  return (
    <main id="about">
      <StoryExperience />
      <CulinaryMastersSection />
    </main>
  );
}

