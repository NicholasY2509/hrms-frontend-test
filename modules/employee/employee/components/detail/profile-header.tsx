'use client';

import * as React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Briefcase01Icon,
  Location01Icon,
  Mail01Icon,
  Tick01Icon,
} from '@hugeicons/core-free-icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Employee } from '../../types';
import Particles from '@/components/Particles';

interface ProfileHeaderProps {
  employee: Employee;
}

export function ProfileHeader({ employee }: ProfileHeaderProps) {
  return (
    <div className="relative py-8 flex flex-col items-center text-center overflow-hidden bg-muted/5 rounded-5xl">
      {/* Fading Border Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-muted-foreground/20 to-transparent z-20" />

      <div
        className="absolute inset-0 z-0 overflow-hidden rounded-5xl opacity-40 dark:opacity-100 pointer-events-none"
        style={{
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
        }}
      >
        <Particles
          particleColors={["#0827e5", "#0091ff", "#60a5fa", "#bae6fd"]}
          particleCount={1000}
          particleSpread={10}
          speed={0.10}
          particleBaseSize={100}
          moveParticlesOnHover={false}
          alphaParticles={true}
          disableRotation
          pixelRatio={1}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="relative mb-3">
          <Avatar className="w-28 h-28 border-4 border-background shadow-md">
            <AvatarImage
              src={employee.photo_url || ''}
              className="object-cover"
            />
            <AvatarFallback className="text-3xl font-semibold bg-muted uppercase">
              {employee.name?.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight">
              {employee.name}
            </h1>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-2 text-[11px] font-semibold">
            <span>{employee.position?.name}</span>
            <span className="w-1 h-1 rounded-full bg-black dark:bg-white" />
            <span>{employee.work_location?.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
