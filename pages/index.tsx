import React from 'react';
import Layout from '../components/Layout';
import { GlobalStyle } from '../components/utils/GlobalStyle';

export default function Home() {
  return (
    <>
      <GlobalStyle/>
      <Layout>
        <div style={{ padding: '20px' }}>
          <h1>Welcome to Our Dynamic Team Builder!</h1>

          <h2>🌟 Discover a New Way to Create and Manage Your Teams!</h2>
          <p>Welcome to a world where building and managing your teams is not just easy, but also fun! Our innovative platform is designed to bring your team-building experience to the next level. Whether you're a fan of assembling dream teams or just looking for an efficient way to organize groups, we've got you covered.</p>
          
          <h3>🔥 Key Features:</h3>
          <ul>
            <li><strong>Create Your Teams</strong>: Craft your unique teams by selecting from a wide array of characters.</li>
            <li><strong>Manage with Ease</strong>: Update your teams as you see fit.</li>
            <li><strong>Visualize Your Team</strong>: See your team come to life!</li>
            <li><strong>Secure and Personalized</strong>: Your teams are your own.</li>
            <li><strong>Community and Sharing</strong>: Engage with a community of fellow team builders.</li>
          </ul>

          <h3>🌐 Seamless Experience Across Devices</h3>
          <p>Our platform is designed for accessibility and ease of use across various devices.</p>

          <h3>🚀 Get Started</h3>
          <p>Dive into the experience of seamless team building. Register today, and start creating teams that resonate with your style and strategy.</p>
        </div>
      </Layout>
    </>
  );
}
