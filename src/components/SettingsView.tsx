/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User as UserIcon, CreditCard, PlayCircle, Bell, ShieldAlert, 
  Trash2, Sliders, Check, Settings, Sparkles, ChevronRight, X 
} from 'lucide-react';
import { User, SettingsTab } from '../types';

interface SettingsViewProps {
  user: User;
  onUpdateUser: (updated: Partial<User>) => void;
  onShowToast: (msg: string) => void;
  onDeleteAccount: () => void;
}

export default function SettingsView({
  user, onUpdateUser, onShowToast, onDeleteAccount
}: SettingsViewProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');
  const [autoplay, setAutoplay] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [promoEmails, setPromoEmails] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmModalData, setConfirmModalData] = useState<{ title: string; desc: string; confirmText: string; action: () => void } | null>(null);

  // Edit fields states
  const [editingField, setEditingField] = useState<'Email' | 'Password' | null>(null);
  const [fieldValue, setFieldValue] = useState("");

  const handleToggle = (field: 'autoplay' | 'push' | 'promo', value: boolean, setter: (val: boolean) => void, msg: string) => {
    setter(!value);
    onShowToast(msg);
  };

  const handleSaveField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldValue.trim()) return;

    if (editingField === 'Email') {
      onUpdateUser({ email: fieldValue.trim() });
      onShowToast("Email database record updated!");
    } else {
      onShowToast("Security password updated successfully!");
    }
    setEditingField(null);
  };

  const openConfirmation = (title: string, desc: string, confirmText: string, action: () => void) => {
    setConfirmModalData({ title, desc, confirmText, action });
    setIsConfirmModalOpen(true);
  };

  const executeConfirmAction = () => {
    if (confirmModalData) {
      confirmModalData.action();
    }
    setIsConfirmModalOpen(false);
    setConfirmModalData(null);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 pb-20 px-4 md:px-[4%] max-w-7xl mx-auto flex flex-col md:flex-row gap-8"
    >
      {/* Confirmation Modal overlay */}
      {isConfirmModalOpen && confirmModalData && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setIsConfirmModalOpen(false)}></div>
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 max-w-sm w-full relative z-10 shadow-2xl space-y-4"
          >
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert size={18} className="text-red-500" />
              {confirmModalData.title}
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {confirmModalData.desc}
            </p>
            <div className="flex gap-4 pt-2">
              <button 
                onClick={() => setIsConfirmModalOpen(false)}
                className="flex-1 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase border border-neutral-800 text-neutral-400 hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={executeConfirmAction}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg active:scale-95 transition-all cursor-pointer"
              >
                {confirmModalData.confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Inline edit details modal */}
      {editingField && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setEditingField(null)}></div>
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-neutral-900 border border-neutral-800 w-full max-w-sm rounded-xl p-6 relative z-10 shadow-2xl space-y-4"
          >
            <h4 className="text-md font-bold text-white uppercase tracking-wider">Update {editingField}</h4>
            <form onSubmit={handleSaveField} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block">New {editingField}</label>
                <input 
                  type={editingField === 'Password' ? 'password' : 'text'}
                  value={fieldValue}
                  onChange={(e) => setFieldValue(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-red-500 text-sm px-4 py-2.5 rounded-lg text-white outline-none "
                  placeholder={`Enter new ${editingField.toLowerCase()}`}
                  required
                />
              </div>
              <div className="flex gap-4 pt-2">
                <button 
                  type="button" 
                  onClick={() => setEditingField(null)}
                  className="flex-1 py-2 text-xs font-bold uppercase tracking-wider border border-neutral-850 hover:bg-neutral-800 rounded-lg text-neutral-400 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold uppercase tracking-wider bg-red-600 rounded-lg text-white cursor-pointer"
                >
                  Save
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Sidebar Navigation Drawer */}
      <aside className="w-full md:w-64 md:shrink-0 flex flex-col gap-2">
        <div className="mb-4 px-2 hidden md:block">
          <div className="flex items-center gap-3">
            <img className="w-12 h-12 rounded-xl object-cover" src={user.avatar} alt="Avatar" />
            <div className="min-w-0">
              <p className="text-sm font-black text-rose-500 truncate flex items-center gap-1">
                <Sparkles size={12} fill="currentColor" />
                Premium
              </p>
              <p className="text-xs text-neutral-500 truncate">Pro Account Plan</p>
            </div>
          </div>
        </div>

        {/* Sidebar Nav Buttons */}
        <nav className="flex md:flex-col gap-1 overflow-x-auto no-scrollbar scroll-smooth">
          {[
            { id: 'account' as SettingsTab, label: 'Account', icon: UserIcon },
            { id: 'subscription' as SettingsTab, label: 'Subscription', icon: CreditCard },
            { id: 'playback' as SettingsTab, label: 'Playback', icon: PlayCircle },
            { id: 'notifications' as SettingsTab, label: 'Notifications', icon: Bell }
          ].map(tab => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  isSelected 
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/10' 
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Right Content Panels */}
      <section className="flex-1 space-y-6">
        <AnimatePresence mode="wait">
          
          {/* ACCOUNT PANEL */}
          {activeTab === 'account' && (
            <motion.div 
              key="sett-acc"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-6"
            >
              <div className="bg-neutral-900/40 border border-neutral-900 p-6 rounded-xl space-y-6">
                <div className="flex items-center gap-2 border-b border-neutral-850 pb-3">
                  <UserIcon size={18} className="text-red-500" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Account Details</h3>
                </div>

                <div className="space-y-4">
                  {/* Email Detail line */}
                  <div className="flex justify-between items-center py-1">
                    <div>
                      <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Email Address</p>
                      <p className="text-sm text-neutral-200 mt-0.5">{user.email}</p>
                    </div>
                    <button 
                      onClick={() => { setFieldValue(user.email); setEditingField('Email'); }}
                      className="text-red-500 hover:text-red-400 text-xs font-bold uppercase tracking-wider hover:underline cursor-pointer"
                    >
                      Change
                    </button>
                  </div>

                  {/* Password detail line */}
                  <div className="flex justify-between items-center py-1">
                    <div>
                      <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Password</p>
                      <p className="text-sm text-neutral-200 mt-0.5">&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;</p>
                    </div>
                    <button 
                      onClick={() => { setFieldValue(""); setEditingField('Password'); }}
                      className="text-red-500 hover:text-red-400 text-xs font-bold uppercase tracking-wider hover:underline cursor-pointer"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-neutral-900/40 border border-red-950/20 p-6 rounded-xl space-y-6">
                <div className="flex items-center gap-2 border-b border-red-950/20 pb-3">
                  <ShieldAlert size={18} className="text-red-500" />
                  <h3 className="text-sm font-bold text-red-500 uppercase tracking-wider">Danger Zone</h3>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-white">Delete Account</h4>
                    <p className="text-xs text-neutral-500 mt-1">Permanently remove all your profile data, playlists, and history records.</p>
                  </div>
                  <button 
                    onClick={() => openConfirmation(
                      "Delete Account", 
                      "This will permanently delete your profile, playlists, and watching history. This actions cannot be undone.", 
                      "Permanently Delete",
                      onDeleteAccount
                    )}
                    className="border border-red-500 text-red-500 hover:bg-red-500/10 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer whitespace-nowrap transition-colors"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* SUBSCRIPTION PANEL */}
          {activeTab === 'subscription' && (
            <motion.div 
              key="sett-sub"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-6"
            >
              {/* Premium Card Display */}
              <div className="relative overflow-hidden rounded-xl bg-neutral-900/80 p-6 border-l-4 border-red-600 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="relative z-10 space-y-2">
                  <h2 className="text-xl font-black text-white">{user.plan}</h2>
                  <p className="text-xs text-neutral-400 max-w-sm">
                    Your premium subscription includes UHD 4K streaming format, offline downloads, and zero commercial ads on up to 4 parallel devices.
                  </p>
                  <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest pt-2">Next Billings: Dec 24, 2026</p>
                </div>

                <div className="relative z-10 flex gap-3">
                  <button 
                    onClick={() => onShowToast("Changing plan formats not supported in prototype")}
                    className="bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest cursor-pointer active:scale-95 transition-transform"
                  >
                    Change Plan
                  </button>
                  <button 
                    onClick={() => onShowToast("Redirecting to credit secure portal...")}
                    className="bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest cursor-pointer"
                  >
                    Billing Options
                  </button>
                </div>
                
                {/* Visual red gradient helper backdrop */}
                <div className="absolute right-0 top-0 w-64 h-64 bg-red-600/10 blur-[100px] -mr-32 -mt-32 rounded-full"></div>
              </div>

              {/* Cancel card */}
              <div className="bg-neutral-900/40 border border-neutral-900 p-6 rounded-xl">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-bold text-white">Cancel Subscription</h4>
                    <p className="text-xs text-neutral-500 mt-1">End your premium subscription at the end of the current billing cycle.</p>
                  </div>
                  <button 
                    onClick={() => openConfirmation(
                      "Cancel Subscription",
                      "Your access will continue until Dec 24, 2026. Are you sure you want to proceed with cancellation?",
                      "End Plan",
                      () => onShowToast("Subscription cancelled.")
                    )}
                    className="border border-red-500 text-red-500 hover:bg-red-500/10 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer"
                  >
                    Cancel Subscription
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* PLAYBACK PANEL */}
          {activeTab === 'playback' && (
            <motion.div 
              key="sett-play"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-6"
            >
              <div className="bg-neutral-900/40 border border-neutral-900 p-6 rounded-xl space-y-6">
                <div className="flex items-center gap-2 border-b border-neutral-850 pb-3">
                  <PlayCircle size={18} className="text-red-500" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Playback Preferences</h3>
                </div>

                <div className="space-y-6">
                  {/* Autoplay toggler */}
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-bold text-white">Autoplay next episode</h4>
                      <p className="text-xs text-neutral-500 mt-1">Automatically start the next episode in a series once finished.</p>
                    </div>

                    <button 
                      onClick={() => handleToggle('autoplay', autoplay, setAutoplay, autoplay ? "Autoplay turned off" : "Autoplay enabled")}
                      className={`w-11 h-6 rounded-full relative transition-all duration-300 cursor-pointer ${
                        autoplay ? 'bg-red-600' : 'bg-neutral-800'
                      }`}
                    >
                      <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                        autoplay ? 'translate-x-5' : 'translate-x-0'
                      }`}></span>
                    </button>
                  </div>

                  {/* Quality Select details */}
                  <div className="flex justify-between items-center border-t border-neutral-850/50 pt-4">
                    <div>
                      <h4 className="text-sm font-bold text-white">Data usage & resolution</h4>
                      <p className="text-xs text-neutral-500 mt-1">High quality (4K UHD) streaming on active Wi-Fi structures.</p>
                    </div>
                    <button 
                      onClick={() => onShowToast("Resolution standard locked to Auto")}
                      className="text-neutral-300 hover:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                    >
                      Automatic
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => onShowToast("Preferences saved!")}
                className="w-full bg-red-650/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
              >
                Save Playback Preferences
              </button>
            </motion.div>
          )}

          {/* NOTIFICATIONS PANEL */}
          {activeTab === 'notifications' && (
            <motion.div 
              key="sett-not"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-6"
            >
              <div className="bg-neutral-900/40 border border-neutral-900 p-6 rounded-xl space-y-6">
                <div className="flex items-center gap-2 border-b border-neutral-850 pb-3">
                  <Bell size={18} className="text-red-500" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Configure Alerts</h3>
                </div>

                <div className="space-y-6">
                  {/* Push alerts toggle */}
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-bold text-white">New Content Alerts</h4>
                      <p className="text-xs text-neutral-500 mt-1">Get notified of releases of episodes, trailers, or recommended movies.</p>
                    </div>

                    <button 
                      onClick={() => handleToggle('push', pushAlerts, setPushAlerts, pushAlerts ? "In-app alerts muted" : "New content alerts active")}
                      className={`w-11 h-6 rounded-full relative transition-all duration-300 cursor-pointer ${
                        pushAlerts ? 'bg-red-600' : 'bg-neutral-800'
                      }`}
                    >
                      <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                        pushAlerts ? 'translate-x-5' : 'translate-x-0'
                      }`}></span>
                    </button>
                  </div>

                  {/* Promo emails slider toggle */}
                  <div className="flex justify-between items-center border-t border-neutral-850/50 pt-4">
                    <div>
                      <h4 className="text-sm font-bold text-white">Promotional Emails</h4>
                      <p className="text-xs text-neutral-500 mt-1">Stay updated with newsletter highlights, discount announcements, or surveys.</p>
                    </div>

                    <button 
                      onClick={() => handleToggle('promo', promoEmails, setPromoEmails, promoEmails ? "Marketing emails unsubscribed" : "Subscribed to promotional newsletter")}
                      className={`w-11 h-6 rounded-full relative transition-all duration-300 cursor-pointer ${
                        promoEmails ? 'bg-red-600' : 'bg-neutral-800'
                      }`}
                    >
                      <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                        promoEmails ? 'translate-x-5' : 'translate-x-0'
                      }`}></span>
                    </button>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => onShowToast("Notifications preferences saved!")}
                className="w-full bg-red-650/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
              >
                Update Notification preferences
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </section>
    </motion.div>
  );
}
