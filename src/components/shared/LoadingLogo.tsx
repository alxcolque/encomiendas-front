import logoUrl from '@/assets/kolmox-logo.png';

interface LoadingLogoProps {
    className?: string;
}

export function LoadingLogo({ className = "" }: LoadingLogoProps) {
    // We use animate-pulse by default if no animation is provided,
    // but allow custom classes to override it.
    const animationClass = className.includes('animate-') ? '' : 'animate-pulse';

    return (
        <img
            src={logoUrl}
            alt="Cargando..."
            className={`object-contain ${animationClass} ${className}`}
        />
    );
}
