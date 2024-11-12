import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
const Home = lazy(() => import("@/pages/Home"));
const Plinko = lazy(() => import("@/pages/Plinko"));

function App() {
  return (
    <main className=" w-full h-dvh">
      <Suspense fallback={<p>Loading...</p>}>
        <Routes>
          <Route path="/" Component={Home} />
          <Route path="/plinko" Component={Plinko} />
          <Route path="*" element={<h2>Page Not Found</h2>} />{" "}
        </Routes>
      </Suspense>
    </main>
  );
}

export default App;
