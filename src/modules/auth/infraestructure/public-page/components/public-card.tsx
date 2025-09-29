import React from "react";

export interface PublicCardProps {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}

export const PublicCard = ({
  icon: Icon,
  title,
  children,
}: PublicCardProps) => {
  return (
    <div className="public-card shadow-lg">
      <Icon className="h-12 w-12 stroke-[var(--green-primary)] stroke-[0.6] text-transparent" />
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-gray-600">{children}</p>
      </div>
    </div>
  );
};
