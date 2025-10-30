"use client";
import React from "react";
import { Code2, Users, Zap, Shield, Globe, Sparkles } from "lucide-react";
import FeatureCard from "./featureCard";
const Features = () => {
  const features = [
    {
      icon: Code2,
      title: "Real-time Collaboration",
      description:
        "Code together with your team in real-time with synchronized editing powered by Yjs",
    },
    {
      icon: Users,
      title: "Multi-user Support",
      description:
        "See who's online, track cursor positions, and collaborate seamlessly",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Instant updates and ultra-low latency for the best coding experience",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description:
        "End-to-end encryption ensures your code stays private and secure",
    },
    {
      icon: Globe,
      title: "Work Anywhere",
      description:
        "Access your projects from any device, anywhere in the world",
    },
    {
      icon: Sparkles,
      title: "Smart Features",
      description: "Intelligent code completion, syntax highlighting, and more",
    },
  ];
  return (
    <div className="flex flex-col bg-[#0F1419] justify-center items-center p-4 md:p-30">
      <div className="flex text-white text-3xl text-center md:text-5xl">
        Why choose CodeSync?
      </div>
      <div className="flex text-gray-400 p-4 text-center md:text-2xl">
        everything you need for collaborative Work
      </div>
      <div className="w-[80%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature, key) => (
          <FeatureCard
            key={key}
            logo={<feature.icon className="text-logoicon-500 h-10 w-10" />}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </div>
  );
};

export default Features;
