import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { OfferService } from "../services/offer.services"
import Offer from "../models/Offer"
import { StarRating } from "../components/StarRating"

function OfferDetail() {
  const {id} = useParams()
  const [offer, setOffer] = useState<Offer>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    OfferService
      .getById(Number(id))
      .then(setOffer)
      .catch(error => setError(error.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!offer) return <div>Oferta no encontrada</div>

  return (
    <div className="flex justify-center p-6 bg-green-800 rounded-lg shadow-lg max-w-4xl mx-auto mt-8">
      <div className="bg-white rounded-lg p-8 shadow-xl w-full">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-green-900">{offer.title}</h1>
        <p className="text-2xl font-semibold text-gray-700 dark:text-green-900 mt-2">{offer.description}</p>
        
        
        {offer.price && (
          <p className="mt-4 text-2xl font-semibold text-gray-700 dark:text-green-900">
            <strong>Precio:</strong>  {offer.price.toFixed(2)}€
          </p>
        )}

        <div className="mt-4">
          <StarRating idOffer={Number(id)} />
        </div>

        <div className="mt-4 text-lg text-gray-800">
          <p><strong>Activo:</strong> {offer.active ? 'Sí' : 'No'}</p>
          <p><strong>Email del vendedor:</strong> {offer.contactEmail}</p>
          <p><strong>Fecha publicación:</strong> {new Date(offer.published).toLocaleString()}</p>
          <p><strong>Fecha finalización:</strong> {new Date(offer.expired).toLocaleString()}</p>
        </div>

        {offer.location && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Localización:</h3>
            <iframe
              width="100%"
              height="300"
              loading="lazy"
              src={`https://www.google.com/maps?q=${offer.location}&output=embed`}
              className="rounded-lg mt-2"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default OfferDetail
