import { useEffect } from 'react';

export function useDeepLinking() {
    useEffect(() => {
        handleDeepLinking();
    }, []);

    function handleDeepLinking() {
        const hash = window.location.hash;
        if (!hash) return;

        const match = hash.match(/^#alias-(user|project|org)-(.+)$/);
        if (!match) return;

        const [, , encodedOriginal] = match;
        const original = decodeURIComponent(encodedOriginal);

        const scrollAndHighlight = () => {
            const aliasItem = document.querySelector(
                `.alias-item[data-original="${CSS.escape(original)}"]`
            ) as HTMLElement;

            if (aliasItem) {
                aliasItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                aliasItem.style.backgroundColor = '#fff3cd';
                aliasItem.style.border = '2px solid #ffc107';
                aliasItem.style.transition = 'all 0.3s ease';
                aliasItem.style.boxShadow = '0 0 10px rgba(255, 193, 7, 0.5)';

                setTimeout(() => {
                    aliasItem.style.backgroundColor = '';
                    aliasItem.style.border = '';
                    aliasItem.style.boxShadow = '';
                }, 3000);

                return true;
            }
            return false;
        };

        if (!scrollAndHighlight()) {
            setTimeout(() => {
                if (!scrollAndHighlight()) {
                    setTimeout(scrollAndHighlight, 2000);
                }
            }, 1000);
        }
    }
}
