import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`inline-flex items-center leading-5 transition duration-150 ease-in-out
                ${className}
            `}
        >
            {children}
        </Link>
    );
}
