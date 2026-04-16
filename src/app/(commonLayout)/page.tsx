import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen gap-6">
      common layout
      <Button variant="outline" className="w-full">
        Get Started
      </Button>
    </div>
  );
}
