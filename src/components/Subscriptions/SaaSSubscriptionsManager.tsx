import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  ShieldCheck,
  Zap,
  Building2,
  Users,
  CreditCard,
  Crown,
  ChevronRight,
  RefreshCw,
  Clock,
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { SaaSSubscriptionPlan } from '../../types';

export const SaaSSubscriptionsManager: React.FC = () => {
  const { currentSubscription, upgradeSubscriptionPlan, tenantUsers } = usePOS();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  const plans: SaaSSubscriptionPlan[] = [
    {
      id: 'starter',
      name: 'Starter Restaurant',
      priceMonthly: 29,
      priceYearly: 290,
      maxUsers: 5,
      maxOutlets: 1,
      maxOrdersPerMonth: 1000,
      features: [
        'Single Restaurant Outlet',
        'Food POS Terminal with 3-Step Bill Printing',
        'Up to 2 Waiter App Accounts',
        'Kitchen Display System (KDS)',
        'Cash & Card Payments',
        'Daily Sales Reports',
      ],
    },
    {
      id: 'pro',
      name: 'Pro Multi-Outlet SaaS',
      priceMonthly: 79,
      priceYearly: 790,
      isPopular: true,
      maxUsers: 9999,
      maxOutlets: 5,
      maxOrdersPerMonth: 999999,
      features: [
        'Up to 5 Restaurant Branches / Outlets',
        'Unlimited Waiter & Chef Accounts',
        'Table Floor Plan & Advance Booking Engine',
        '11+ Global Payment Gateways',
        'Customer Khata Ledger & 1-Click WhatsApp Reminders',
        'Catering Quotations with 1-Click Convert to Sale',
        'Delivery Dispatch & Rider Assignment App',
        'Thermal Bluetooth/WiFi Printer (80mm & 58mm)',
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise Franchise SaaS',
      priceMonthly: 199,
      priceYearly: 1990,
      maxUsers: 99999,
      maxOutlets: 999,
      maxOrdersPerMonth: 9999999,
      features: [
        'Unlimited Restaurant Outlets & Franchises',
        'Super-Admin Multi-Tenant Management Console',
        'Full Laravel REST API & Webhooks Access',
        'Custom Domain & Whitelabel Branding',
        'Priority 24/7 SLA Engineering Support',
        'Dedicated Cloud PostgreSQL & Database Backups',
      ],
    },
  ];

  const handleSelectPlan = (plan: SaaSSubscriptionPlan) => {
    upgradeSubscriptionPlan(plan.id);
    alert(`Successfully activated ${plan.name}! Your SaaS subscription is now active.`);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100 overflow-hidden">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-lg text-slate-900">SaaS License & Multi-Store Subscriptions</h2>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-300">
                ACTIVE PLAN: {currentSubscription.planName.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Manage regular & extended SaaS licenses, multi-branch scaling, and staff seats</p>
          </div>
        </div>

        {/* Billing Cycle Switcher */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              billingCycle === 'monthly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
              billingCycle === 'yearly' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600'
            }`}
          >
            <span>Yearly (Save 20%)</span>
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Pricing Cards Grid */}
      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isCurrent = currentSubscription.planId === plan.id;
            const price = billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly;

            return (
              <div
                key={plan.id}
                id={`saas-plan-card-${plan.id}`}
                className={`bg-white rounded-3xl border p-6 flex flex-col justify-between transition-all shadow-sm relative ${
                  plan.isPopular
                    ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-xl'
                    : 'border-slate-200'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-amber-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                    Most Popular for Restaurants
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-lg text-slate-900">{plan.name}</h3>
                    {isCurrent && (
                      <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Current Plan
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mt-4 pb-4 border-b border-slate-100 flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900">${price}</span>
                    <span className="text-xs text-slate-500 font-semibold">
                      /{billingCycle === 'yearly' ? 'year' : 'month'}
                    </span>
                  </div>

                  {/* Feature Checklist */}
                  <div className="py-4 space-y-2.5">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Features Included:</p>
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                        <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom CTA */}
                <div className="pt-4 border-t border-slate-100">
                  <button
                    id={`upgrade-plan-btn-${plan.id}`}
                    disabled={isCurrent}
                    onClick={() => handleSelectPlan(plan)}
                    className={`w-full py-3 rounded-2xl text-xs font-black transition-all active:scale-97 flex items-center justify-center gap-1.5 shadow-md ${
                      isCurrent
                        ? 'bg-slate-100 text-slate-400 cursor-default'
                        : plan.isPopular
                        ? 'bg-amber-600 hover:bg-amber-700 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    <span>{isCurrent ? 'Active Subscription' : 'Activate This Plan'}</span>
                    {!isCurrent && <ChevronRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
