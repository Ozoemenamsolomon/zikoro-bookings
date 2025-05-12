'use client'
import React from 'react'
import { Button } from "@/components/ui/button";
import { Progress } from '@/components/ui/progress';
import { SubscriptionPlanInfo } from '@/types';
import { subscriptionPlansValue } from '@/constants';

const WorkspaceAnalytics = ({permissions}:{permissions:SubscriptionPlanInfo}) => {
  if (!permissions) return <div className="p-6 text-center">No data found for analytics</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Subscription Analytics</h1>

      <SubscriptionCallouts permissions={permissions} />
      <UsageStats permissions={permissions} />
      <SubscriptionProgress permissions={permissions} />
      <PlanFeaturesTable currentPlan={permissions.effectivePlan} />
      <UpgradePrompt permissions={permissions} /> 
    </div>
  );
}

export default WorkspaceAnalytics


import { AlertCircle } from "lucide-react";

interface CalloutProps {
  title: string;
  message: string;
  actionLabel?: string;
  actionHref?: string;
}

export function Callout({ title, message, actionLabel, actionHref }: CalloutProps) {
  return (
    <div className="flex items-start gap-4 rounded-lg border border-yellow-300 bg-yellow-50 p-4">
      <AlertCircle className="h-6 w-6 text-yellow-500 mt-1" />
      <div className="flex-1 space-y-1">
        <h4 className="text-sm font-semibold text-yellow-800">{title}</h4>
        <p className="text-sm text-yellow-700">{message}</p>
        {actionLabel && actionHref && (
          <Button asChild variant="outline" size="sm" className="mt-2">
            <a href={actionHref}>{actionLabel}</a>
          </Button>
        )}
      </div>
    </div>
  );
}

interface BannerProps {
    children: React.ReactNode;
  }
  
  export function Banner({ children }: BannerProps) {
    return (
      <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-800 border border-blue-300">
        {children}
      </div>
    );
  }
  

export function SubscriptionCallouts({ permissions }: { permissions: any }) {
  return (
    <div className="space-y-4">
      {permissions.shouldShowRenewPrompt && (
        <Callout
          title="Plan Expired"
          message={permissions.displayMessage}
          actionLabel="Renew Plan"
          actionHref={permissions.reactivateLink}
        />
      )}
      {permissions.showTrialEndingSoonPrompt && (
        <Banner>
          {`Your ${permissions.effectivePlan} plan expires in ${permissions.validDaysRemaining} day(s). Upgrade now to keep premium features.`}
        </Banner>
      )}
    </div>
  );
}


import { Card, CardContent } from "@/components/ui/card";
import Link from 'next/link';
import Upgradeworkspace from './Upgradeworkspace';
import useUserStore from '@/store/globalUserStore';

export function UsageStats({ permissions }: { permissions: any }) {
  const stats = [
    { label: "Bookings this Month", value: permissions.bookingsCount },
    { label: "Booking Limit", value: permissions.bookingLimit },
    { label: "Team Members Allowed", value: permissions.teamLimit },
    { label: "SMS Notifications", value: permissions.smsEnabled ? "Enabled" : "Disabled" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-xl font-bold">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}


export function SubscriptionProgress({ permissions }: { permissions: any }) {
  return (
    <div>
      <h3 className="font-semibold mb-2">Subscription Period Progress</h3>
      <Progress value={permissions.daysLeftPercentage} />
      <p className="text-sm text-gray-500 mt-2">
        {permissions.validDaysRemaining} day(s) remaining.
      </p>
    </div>
  );
}


export function PlanFeaturesTable({ currentPlan }: { currentPlan: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-4">Compare Plan Features</h3>
        <table className="w-full text-sm border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 text-left">Plan</th>
              <th className="p-2 text-left">Bookings/Month</th>
              <th className="p-2 text-left">Team Members</th>
              <th className="p-2 text-left">SMS Reminders</th>
              <th className="p-2 text-left">Email Reminders</th>
            </tr>
          </thead>
          <tbody>
            {subscriptionPlansValue.map((plan, idx) => (
              <tr
                key={idx}
                className={
                  plan.label === currentPlan ? "bg-purple-200 font-bold" : ""
                }
              >
                <td className="p-2">{plan.label}</td>
                <td className="p-2">{plan.features.maxBookingsPerMonth}</td>
                <td className="p-2">{plan.features.teamMembers}</td>
                <td className="p-2">
                  {plan.features.smsNotification ? "Yes" : "No"}
                </td>
                <td className="p-2">
                  {plan.features.emailNotification ? "Yes" : "No"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}




export function UpgradePrompt({ permissions }: { permissions: any }) {
  const {user, currentWorkSpace} = useUserStore()

  if(currentWorkSpace?.subscriptionPlan ==='Enterprise') return null

  return (
    <div className="text-center gap-2 flex flex-col items-center">
      <h3 className="text-lg font-semibold">Need more power?</h3>
      <p className="text-sm text-gray-500">Upgrade your plan to unlock more features and higher limits.</p>
      <div className="flex justify-items-center">
        <Upgradeworkspace />
        {/* <Link href={'#'} className='py-3 text-center w-full bg-basePrimary rounded-md flex justify-center text-white px-6 '>
            Upgrade Plan
        </Link > */}
      </div>
    </div>
  );
}
