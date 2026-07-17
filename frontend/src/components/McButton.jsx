import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Pixelated loading spinner — a small animated square block.
 */
const PixelSpinner = () => (
  <span
    className="inline-block w-3 h-3 bg-white/80 animate-spin"
    style={{ imageRendering: 'pixelated', animationDuration: '0.6s' }}
    aria-hidden="true"
  />
);

/**
 * McButton — reusable Minecraft-style button.
 *
 * Renders as a react-router <Link> when the `to` prop is provided,
 * otherwise renders a standard <button>.
 *
 * @param {'default'|'primary'|'danger'} variant – visual style
 * @param {'sm'|'md'|'lg'}              size    – size preset
 * @param {boolean}                     loading – show spinner & disable
 * @param {string}                      to      – renders as <Link> when set
 */
const McButton = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  to,
  ...rest
}) => {
  /* ── Variant classes ─────────────────────────────────────── */
  const variantMap = {
    default: '',
    primary: 'mc-button-green',
    danger:  '!bg-mc-redstone/90 hover:!bg-mc-redstone',
  };

  /* ── Size classes ────────────────────────────────────────── */
  const sizeMap = {
    sm: 'text-[8px] px-3 py-1.5',
    md: '',                         // mc-button already sizes at md
    lg: 'text-sm px-8 py-4',
  };

  const isDisabled = disabled || loading;

  const classes = [
    'mc-button',
    variantMap[variant] ?? '',
    sizeMap[size] ?? '',
    isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const inner = (
    <>
      {loading && <PixelSpinner />}
      <span className={loading ? 'ml-2' : ''}>{children}</span>
    </>
  );

  /* ── Render as Link if `to` is supplied ──────────────────── */
  if (to && !isDisabled) {
    return (
      <Link to={to} className={`inline-flex items-center justify-center ${classes}`} {...rest}>
        {inner}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center ${classes}`}
      {...rest}
    >
      {inner}
    </button>
  );
};

export default McButton;
