import React from 'react';
import { Award, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

interface CharterStampBadgeProps {
  variant: 'RECOMMENDED' | 'FEASIBLE' | 'REJECTED' | 'WARNING' | 'CUSTOM';
  label?: string;
  sublabel?: string;
  icon?: React.ReactNode;
}

export const CharterStampBadge: React.FC<CharterStampBadgeProps> = ({
  variant,
  label,
  sublabel,
  icon
}) => {
  let styleClasses = 'stamp-badge-brass';
  let defaultLabel = 'RECOMMENDED STRATEGY';
  let DefaultIcon = <Award className="w-3 h-3 text-[#A9793A]" />;

  if (variant === 'FEASIBLE') {
    styleClasses = 'stamp-badge-feasible';
    defaultLabel = 'APPROVED FOR CHARTER';
    DefaultIcon = <CheckCircle2 className="w-3 h-3 text-[#2D6A4F]" />;
  } else if (variant === 'REJECTED') {
    styleClasses = 'stamp-badge-rejected';
    defaultLabel = 'DRAFT CONSTRAINED — REJECTED';
    DefaultIcon = <ShieldAlert className="w-3 h-3 text-[#A32D2D]" />;
  } else if (variant === 'WARNING') {
    styleClasses = 'stamp-badge-warning';
    defaultLabel = 'OPERATIONAL WARNING';
    DefaultIcon = <AlertTriangle className="w-3 h-3 text-[#9C6615]" />;
  }

  return (
    <div className={`stamp-badge ${styleClasses}`}>
      {icon || DefaultIcon}
      <span className="font-mono font-bold tracking-wider">{label || defaultLabel}</span>
      {sublabel && <span className="opacity-75 text-[9px] font-sans">({sublabel})</span>}
    </div>
  );
};
