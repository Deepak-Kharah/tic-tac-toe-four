import Homepage from "../components/Homepage/Homepage.component";
import { WEBSITE_JSON_LD } from "@/common/metadata.constant";

export default function Home() {
  return (
    <>
      <main className="flex justify-center items-center flex-1">
        <Homepage />
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSON_LD) }}
      />
    </>
  );
}
