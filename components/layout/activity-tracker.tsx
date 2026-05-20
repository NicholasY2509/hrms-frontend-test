'use client';

import React, { useEffect, useState } from 'react';
import { useActivityStore, ActivityType } from '@/hooks/use-activity-store';
import { useAuth } from '@/modules/auth/hooks/auth-context';
import Cookies from 'js-cookie';
import { initEcho } from '@/lib/echo';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Cancel01Icon,
  Download01Icon,
  DocumentValidationIcon,
  Database02Icon,
  ActivityIcon,
  CloudServerIcon,
  FileUploadIcon
} from '@hugeicons/core-free-icons';
import apiClient from '@/lib/api-client';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';

const getActivityIcon = (type: ActivityType) => {
  switch (type) {
    case 'report':
    case 'report_generation': return DocumentValidationIcon;
    case 'attendance_calculation': return Database02Icon;
    case 'migration': return Database02Icon;
    case 'sync': return CloudServerIcon;
    case 'zkteco_user_sync': return CloudServerIcon;
    case 'zkteco_attendance_sync': return CloudServerIcon;
    case 'bulk_upload': return FileUploadIcon;
    default: return ActivityIcon;
  }
};

function ActivityTrackerItem({ activity }: { activity: any }) {
  const { removeActivity, updateActivity } = useActivityStore();
  const id = activity.id;
  const [displayProgress, setDisplayProgress] = useState(activity.progress || 0);

  useEffect(() => {
    if (activity.progress > displayProgress) {
      setDisplayProgress(activity.progress);
    }
    if (activity.status === 'completed') {
      setDisplayProgress(100);
    }
  }, [activity.progress, activity.status]);

  useEffect(() => {
    if (activity.status !== 'processing' || displayProgress >= 95) return;

    const interval = setInterval(() => {
      setDisplayProgress((prev: any) => {
        const increment = Math.random() * 0.5;
        return Math.min(prev + increment, 95);
      });
    }, 800);

    return () => clearInterval(interval);
  }, [activity.status, displayProgress]);

  // Auto-remove after 10 seconds if completed/failed
  useEffect(() => {
    if (activity.status === 'completed' || activity.status === 'failed') {
      const timer = setTimeout(() => {
        removeActivity(id);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [activity.status, id, removeActivity]);

  // Specific logic for reports (fetching download URL)
  useEffect(() => {
    const isReport = activity.type === 'report' || activity.type === 'report_generation';
    if (isReport && activity.status === 'completed' && !activity.download_url) {
      const reportId = activity.metadata?.report_id || id;
      apiClient.get(`/v1/system/reports/${reportId}`).then((res) => {
        if (res.data?.data?.download_url) {
          updateActivity(id, { download_url: res.data.data.download_url });
        }
      });
    }
  }, [activity.status, activity.type, id, activity.download_url, updateActivity]);

  const isCompleted = activity.status === 'completed';
  const isFailed = activity.status === 'failed';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{
        opacity: 0,
        x: 100,
        scale: 0.9,
        transition: { duration: 0.3, ease: 'easeIn' }
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30
      }}
      className="w-80 bg-background border shadow-2xl rounded-2xl p-4 flex flex-col gap-3 pointer-events-auto overflow-hidden relative"
    >
      {activity.status === 'processing' && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: 'linear',
          }}
          className="absolute inset-0 bg-linear-to-r from-transparent via-primary/20 to-transparent z-0 pointer-events-none -skew-x-12"
        />
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={getActivityIcon(activity.type)} className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold truncate max-w-[180px]">
            {activity.name}
          </span>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => removeActivity(id)}>
          <HugeiconsIcon icon={Cancel01Icon} className="w-4 h-4 text-muted-foreground" />
        </Button>
      </div>

      {!isCompleted && !isFailed && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="truncate pr-2">{activity.current_message || 'Processing...'}</span>
            <span>{Math.floor(displayProgress)}%</span>
          </div>
          <Progress
            value={displayProgress}
            className="h-1.5"
            indicatorClassName="animate-progress-shimmer"
          />
        </div>
      )}

      {isCompleted && (
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-primary font-medium">
              <span>Selesai</span>
              <span>100%</span>
            </div>
            <Progress value={100} className="h-1.5 bg-primary/10" indicatorClassName="bg-primary" />
          </div>

          {activity.type === 'report' || activity.type === 'report_generation' ? (
            <Button asChild size="sm" className="w-full" disabled={!activity.download_url}>
              {activity.download_url ? (
                <a
                  href={activity.download_url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => {
                    setTimeout(() => removeActivity(id), 100);
                  }}
                >
                  <HugeiconsIcon icon={Download01Icon} className="w-4 h-4 mr-2" />
                  Download Sekarang
                </a>
              ) : (
                <span>Menyiapkan link...</span>
              )}
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="w-full" onClick={() => removeActivity(id)}>
              Tutup
            </Button>
          )}
        </div>
      )}

      {isFailed && (
        <div className="flex flex-col gap-2">
          <span className="text-xs text-destructive font-medium">
            Gagal: {activity.current_message || 'Unknown error'}
          </span>
          <Button variant="outline" size="sm" onClick={() => removeActivity(id)}>Tutup</Button>
        </div>
      )}
    </motion.div>
  );
}

export function ActivityTrackerContainer() {
  const { activities, updateActivity } = useActivityStore();
  const { user } = useAuth();
  const activeActivities = Object.values(activities);

  useEffect(() => {
    if (!user) return;
    const token = Cookies.get('access_token');
    if (!token) return;

    const echo = initEcho(token);
    if (!echo) return;

    const activityChannel = `activities.${user.id}`;
    const taskChannel = `tasks.${user.id}`;

    echo.private(activityChannel)
      .listen('.activity.progress', (e: any) => {
        if (e.id) {
          updateActivity(e.id, {
            status: e.status,
            progress: e.progress,
            current_message: e.current_message,
          });
        }
      });

    echo.private(taskChannel)
      .listen('.task.progress', (e: any) => {
        if (e.id) {
          updateActivity(e.id, {
            status: e.status,
            progress: e.progress,
            current_message: e.message || e.current_message,
            type: e.type,
            metadata: e.metadata
          });
        }
      });

    // Legacy support for report events if still used
    echo.private(`reports.${user.id}`)
      .listen('.report.progress', (e: any) => {
        if (e.id) {
          updateActivity(e.id, {
            status: e.status,
            progress: e.progress,
            current_message: e.current_message,
            type: 'report'
          });
        }
      });

    return () => {
      echo.leaveChannel(activityChannel);
      echo.leaveChannel(taskChannel);
      echo.leaveChannel(`reports.${user.id}`);
    };
  }, [user, updateActivity]);

  if (activeActivities.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-100 flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {activeActivities.map((activity) => (
          <ActivityTrackerItem key={activity.id} activity={activity} />
        ))}
      </AnimatePresence>
    </div>
  );
}
