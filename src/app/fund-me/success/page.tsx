import SuccessDive from "./SuccessDive";

export default function PaymentSuccessPage() {
  return (
    <>
      {/* Crawlable real-DOM copy of the confirmation — bots read what the canvas hides.
          No dynamic query content (session_id) is placed here. */}
      <div className="sr-only">
        <h1>Thank You So Much!</h1>
        <p>Your support means the world to me!</p>
        <h2>Payment Successful!</h2>
        <p>
          Your contribution will help me continue building amazing projects, improving my skills,
          and creating valuable content for the community.
        </p>
        <p>You&apos;ll receive a receipt via email shortly.</p>
        <h3>What&apos;s Next?</h3>
        <ul>
          <li>
            <strong>Stay Connected:</strong> Follow me on LinkedIn for updates on new projects
          </li>
          <li>
            <strong>Check Out My Work:</strong> Explore my portfolio and recent projects
          </li>
          <li>
            <strong>Let&apos;s Collaborate:</strong> Got a project idea? Let&apos;s discuss it!
          </li>
        </ul>
      </div>

      <SuccessDive />
    </>
  );
}
