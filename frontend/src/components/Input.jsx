export default function Input({
    label,
    error,
    icon: Icon,
    className = '',
    ...props
}) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium mb-2">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                )}
                <input
                    className={`
                        w-full px-4 py-3 bg-background border border-border rounded-lg
                        focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${Icon ? 'pl-11' : ''}
                        ${error ? 'border-destructive' : ''}
                        ${className}
                    `}
                    {...props}
                />
            </div>
            {error && (
                <p className="mt-1 text-sm text-destructive">{error}</p>
            )}
        </div>
    );
}
