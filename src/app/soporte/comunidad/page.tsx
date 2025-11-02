import { redirect } from "next/navigation";

export default function ComunidadPage() {
  // Redirect to Samsung Community external page
  redirect(
    "https://r1.community.samsung.com/t5/colombia/ct-p/co?profile.language=es&page=1&tab=recent_topics"
  );
}
