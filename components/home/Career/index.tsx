import api from "@/api";
import CareerList from './CareerList';

export default async function Career() {
  const careers = await api.getDataList("career") as Career[];
  return (
    <section id="career" className="flex flex-col items-center justify-center gap-5 py-12 md:py-16 lg:py-28 bg-pale-beige">
      <h1>Career</h1>
      <CareerList careers={careers}/>
    </section>
  )
}
