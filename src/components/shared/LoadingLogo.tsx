
const LoadingLogo = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="animate-spin">
                🦉
            </div>
            <p className="mt-4 text-lg font-semibold text-gray-600">Loading...</p>
        </div>
    );
};

export default LoadingLogo;