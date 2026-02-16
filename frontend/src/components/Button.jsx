export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    loading = false,
    ...props
}) {
    const baseClasses = 'font-semibold rounded-full transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-primary/50',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border',
        outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground',
        danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        ghost: 'bg-transparent hover:bg-secondary',
    };

    const sizeClasses = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    };

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            )}
            {children}
        </button>
    );
}
