export default function PortalCredits({ className = '' }) {
  return (
    <p className={['portal-credits', className].filter(Boolean).join(' ')}>
      <span>All Rights Reserved. Port City BPO (Pvt) Ltd.</span>
      <span>Employee Break Tracking System</span>
      <span>Developer Version 5.1.0</span>
    </p>
  );
}
