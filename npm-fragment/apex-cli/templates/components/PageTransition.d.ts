declare global {
    interface Window {
        __isPageTransitionComplete?: boolean;
    }
}
declare const PageTransition: ({ children }: {
    children: React.ReactNode;
}) => any;
export default PageTransition;
//# sourceMappingURL=PageTransition.d.ts.map