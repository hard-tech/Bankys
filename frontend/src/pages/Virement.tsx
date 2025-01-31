import VirementForm from "../components/VirementCreate";

const Virement = () => {

  return(
    <>
    <section className="flex flex-col items-center min-h-screen bg-gray-100 py-12 px-6">
    <h3 className="text-2xl font-semibold text-gray-700 mb-4">💸 Effectuer un Virement</h3>
    <VirementForm />
    </section>
    </>
  )
}

export default Virement;
