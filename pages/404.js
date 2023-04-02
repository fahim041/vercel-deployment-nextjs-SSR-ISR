import Link from "next/link";

export default function Custom404() {
  return (
    <main>
      <h1>404 - Page Not Found</h1>
      <p>
        <Link href="/">
          <button className="btn-blue">Go Home</button>
        </Link>
      </p>
    </main>
  );
}
