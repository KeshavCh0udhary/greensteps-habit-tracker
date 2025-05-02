
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Users } from 'lucide-react';

interface CommunityCardProps {
  id: string;
  name: string;
  description: string;
  icon: string;
  memberCount: number;
}

const CommunityCard: React.FC<CommunityCardProps> = ({ 
  id, 
  name, 
  description, 
  icon, 
  memberCount 
}) => {
  return (
    <Card className="border shadow-md bg-card/80 backdrop-blur-sm hover:shadow-lg transition-shadow overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col">
          <div className="p-4 pb-3 border-b border-border/50">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl flex-shrink-0">
                {icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
              </div>
            </div>
          </div>
          <div className="p-3 px-4 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-sm">
              <Users className="h-3.5 w-3.5" />
              <span>{memberCount} members</span>
            </div>
            <Button variant="ghost" size="sm" className="h-8 px-2">
              Details <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityCard;
