
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

export interface CommunityCardProps {
  id: string;
  name: string;
  description: string;
  icon: string;
  memberCount: number;
  isJoined?: boolean;
  onJoin?: (id: string) => void;
  onLeave?: (id: string) => void;
  className?: string;
}

const CommunityCard = ({
  id,
  name,
  description,
  icon,
  memberCount,
  isJoined = false,
  onJoin,
  onLeave,
  className = "",
}: CommunityCardProps) => {
  return (
    <Card className={`overflow-hidden border hover:shadow-md transition-all ${className}`}>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-2xl">
              {icon}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{name}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3 md:mt-0">
            <Badge variant="secondary" className="flex items-center gap-1 h-7 px-2">
              <Users className="h-3 w-3" />
              <span>{memberCount}</span>
            </Badge>
            {isJoined ? (
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-auto"
                onClick={() => onLeave && onLeave(id)}
              >
                Leave
              </Button>
            ) : (
              <Button 
                size="sm" 
                className="ml-auto bg-green-600 hover:bg-green-700"
                onClick={() => onJoin && onJoin(id)}
              >
                Join
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityCard;
