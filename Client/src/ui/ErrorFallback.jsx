function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <>
      <main className="h-screen bg-gray-50 flex items-center justify-center p-12">
        <div className="bg-white border border-gray-100 rounded-md p-12 max-w-4xl w-full text-center">
          <h1 className="mb-4 text-stone-900 text-2xl font-bold">
            Something went wrong 🧐
          </h1>
          <p className="mb-8 text-gray-500 font-mono">{error.message}</p>
          <button
            className="bg-primary px-2 py-4 rounded-md hover:cursor-pointer hover:bg-blue-500 "
            size="large"
            onClick={resetErrorBoundary}
          >
            Try again
          </button>
        </div>
      </main>
    </>
  );
}

export default ErrorFallback;
