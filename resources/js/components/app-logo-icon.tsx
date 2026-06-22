import { ImgHTMLAttributes } from 'react';

type Tone = 'auto' | 'teal' | 'white';

interface AppLogoIconProps extends ImgHTMLAttributes<HTMLImageElement> {
    tone?: Tone;
}

export default function AppLogoIcon({ tone = 'auto', className, ...props }: AppLogoIconProps) {
    const alt = 'Palembang Event Center';

    if (tone === 'white') {
        return <img src="/images/brand/logo-icon-white.png" alt={alt} className={className} {...props} />;
    }
    if (tone === 'teal') {
        return <img src="/images/brand/logo-icon.png" alt={alt} className={className} {...props} />;
    }
    return (
        <>
            <img src="/images/brand/logo-icon.png" alt={alt} className={`dark:hidden ${className ?? ''}`} {...props} />
            <img src="/images/brand/logo-icon-white.png" alt={alt} className={`hidden dark:block ${className ?? ''}`} {...props} />
        </>
    );
}
