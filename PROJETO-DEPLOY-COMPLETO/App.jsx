import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Bike, User, Shirt, Download, Eye, Loader2, XCircle, FileSpreadsheet } from 'lucide-react'
import './App.css'
import instructorImage from './assets/instructor.png'

function App() {
  const [reservations, setReservations] = useState({})
  const [selectedBike, setSelectedBike] = useState(null)
  const [showDialog, setShowDialog] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [cancelPassword, setCancelPassword] = useState('')
  const [bikeToCancel, setBikeToCancel] = useState('')
  const [showReservations, setShowReservations] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    shirtSize: '',
    shirtName: ''
  })

  // Carregar reservas do backend
  const loadReservations = async () => {
    try {
      const response = await fetch('/api/reservations')
      if (response.ok) {
        const data = await response.json()
        const reservationsMap = {}
        data.forEach(reservation => {
          reservationsMap[reservation.bike_id] = {
            name: reservation.name,
            shirtSize: reservation.shirt_size,
            shirtName: reservation.shirt_name,
            timestamp: reservation.timestamp
          }
        })
        setReservations(reservationsMap)
      }
    } catch (error) {
      console.error('Erro ao carregar reservas:', error)
    }
  }

  useEffect(() => {
    loadReservations()
  }, [])

  const handleBikeClick = (bikeId) => {
    if (reservations[bikeId]) {
      // Se já está reservada, preenche automaticamente o campo para cancelar
      setBikeToCancel(bikeId.toString())
      setShowCancelDialog(true)
      return
    }
    setSelectedBike(bikeId)
    setShowDialog(true)
  }

  const handleReservation = async () => {
    if (formData.name && formData.shirtSize && formData.shirtName && selectedBike) {
      setLoading(true)
      try {
        const response = await fetch('/api/reservations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bike_id: selectedBike,
            name: formData.name,
            shirt_size: formData.shirtSize,
            shirt_name: formData.shirtName
          })
        })

        if (response.ok) {
          const newReservation = await response.json();
          setReservations(prevReservations => ({
            ...prevReservations,
            [newReservation.bike_id]: {
              name: newReservation.name,
              shirtSize: newReservation.shirt_size,
              shirtName: newReservation.shirt_name,
              timestamp: newReservation.timestamp
            }
          }));
          setFormData({ name: '', shirtSize: '', shirtName: '' })
          setShowDialog(false)
          setSelectedBike(null)
        } else {
          const error = await response.json()
          alert('Erro ao fazer reserva: ' + error.error)
        }
      } catch (error) {
        console.error('Erro ao fazer reserva:', error)
        alert('Erro ao fazer reserva. Tente novamente.')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleCancelReservation = async () => {
    if (cancelPassword === '190925' && bikeToCancel) {
      setLoading(true)
      try {
        const response = await fetch(`/api/reservations/${bikeToCancel}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          setReservations(prevReservations => {
            const newReservations = { ...prevReservations };
            delete newReservations[parseInt(bikeToCancel)];
            return newReservations;
          });
          setShowCancelDialog(false)
          setCancelPassword('')
          setBikeToCancel('')
        } else {
          const error = await response.json()
          alert('Erro ao cancelar reserva: ' + error.error + (error.existing_bikes ? '\nBikes existentes: ' + error.existing_bikes.join(', ') : ''))
        }
      } catch (error) {
        console.error('Erro ao cancelar reserva:', error)
        alert('Erro ao cancelar reserva. Tente novamente.')
      } finally {
        setLoading(false)
      }
    } else {
      alert('Senha incorreta ou bike não selecionada.')
    }
  }

  const exportToCSV = async () => {
    try {
      const response = await fetch('/api/reservations/export')
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `reservas-bikes-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Erro ao exportar CSV:', error)
      alert('Erro ao exportar CSV. Tente novamente.')
    }
  }

  const exportToExcel = async () => {
    try {
      const response = await fetch('/api/reservations/export-excel')
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `reservas-bikes-veloucos-${new Date().toISOString().split('T')[0]}.xlsx`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Erro ao exportar Excel:', error)
      alert('Erro ao exportar Excel. Tente novamente.')
    }
  }

  const getBikeStatus = (bikeId) => {
    if (reservations[bikeId]) {
      return 'occupied'
    }
    return 'available'
  }

  const BikeCircle = ({ bikeId, className = "" }) => {
    const status = getBikeStatus(bikeId)
    const isReserved = status === 'occupied'
    
    return (
      <div
        className={`bike-circle ${isReserved ? 'occupied' : ''} ${className}`}
        onClick={() => handleBikeClick(bikeId)}
      >
        {isReserved ? (
          <Bike className="h-6 w-6" />
        ) : (
          bikeId.toString().padStart(2, '0')
        )}
        {isReserved && (
          <div className="bike-name">
            {reservations[bikeId].name}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-veloucos p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Bike className="h-10 w-10 text-blue-400" />
            Sistema de Reservas - Aula Especial # Veloucos
          </h1>
          <p className="text-gray-200 text-lg">
            Clique em uma bike disponível para fazer sua reserva
          </p>
        </div>

        {/* Controles */}
        <div className="flex justify-center gap-4 mb-6 flex-wrap">
          <Button 
            onClick={() => setShowReservations(!showReservations)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            {showReservations ? 'Ocultar' : 'Ver'} Reservas
          </Button>
          <Button 
            onClick={exportToExcel}
            disabled={Object.keys(reservations).length === 0}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Exportar Excel
          </Button>
          <Button 
            onClick={exportToCSV}
            disabled={Object.keys(reservations).length === 0}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
          <Button 
            onClick={() => setShowCancelDialog(true)}
            variant="destructive"
            className="flex items-center gap-2"
          >
            <XCircle className="h-4 w-4" />
            Cancelar Reserva
          </Button>
        </div>

        {/* Legenda - Movida para cima do layout das bikes */}
        <div className="flex justify-center gap-8 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full border-2 border-blue-500 bg-white"></div>
            <span className="text-sm text-gray-200">Disponível</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full border-2 border-gray-400 bg-gray-300 flex items-center justify-center">
              <Bike className="h-3 w-3 text-gray-600" />
            </div>
            <span className="text-sm text-gray-200">Ocupada</span>
          </div>
        </div>

        {/* Layout das Bikes - Responsivo */}
        <div className="bikes-studio-layout">
          {/* Primeira fileira: 03, 02, 06, 07 */}
          <div className="row row-1">
            <div className="row-left">
              <BikeCircle bikeId={3} />
              <BikeCircle bikeId={2} />
            </div>
            <div className="row-right">
              <BikeCircle bikeId={6} />
              <BikeCircle bikeId={7} />
            </div>
          </div>

          {/* Segunda fileira: 01, 10 */}
          <div className="row row-2">
            <BikeCircle bikeId={1} />
            <div className="instructor-container">
              <div className="instructor-photo">
                <img src={instructorImage} alt="Instrutor" />
              </div>
              <div className="instructor-label">Instrutor</div>
            </div>
            <BikeCircle bikeId={10} />
          </div>

          {/* Terceira fileira: 04, 05, 09, 08 */}
          <div className="row row-3">
            <div className="row-left">
              <BikeCircle bikeId={4} />
              <BikeCircle bikeId={5} />
            </div>
            <div className="row-right">
              <BikeCircle bikeId={9} />
              <BikeCircle bikeId={8} />
            </div>
          </div>

          {/* Quarta fileira: 11-21 */}
          <div className="row row-4">
            <BikeCircle bikeId={11} />
            <BikeCircle bikeId={12} />
            <BikeCircle bikeId={13} />
            <BikeCircle bikeId={14} />
            <BikeCircle bikeId={15} />
            <BikeCircle bikeId={16} />
            <BikeCircle bikeId={17} />
            <BikeCircle bikeId={18} />
            <BikeCircle bikeId={19} />
            <BikeCircle bikeId={20} />
            <BikeCircle bikeId={21} />
          </div>

          {/* Quinta fileira: 22-24, espaço, 26-29 */}
          <div className="row row-5">
            <BikeCircle bikeId={22} />
            <BikeCircle bikeId={23} />
            <BikeCircle bikeId={24} />
            <div style={{ width: '45px' }}></div> {/* Espaço onde seria a bike 25 */}
            <BikeCircle bikeId={26} />
            <BikeCircle bikeId={27} />
            <BikeCircle bikeId={28} />
            <BikeCircle bikeId={29} />
          </div>

          {/* Sexta fileira: 30-38 */}
          <div className="row row-6">
            <BikeCircle bikeId={30} />
            <BikeCircle bikeId={31} />
            <BikeCircle bikeId={32} />
            <BikeCircle bikeId={33} />
            <BikeCircle bikeId={34} />
            <BikeCircle bikeId={35} />
            <BikeCircle bikeId={36} />
            <BikeCircle bikeId={37} />
            <BikeCircle bikeId={38} />
          </div>
        </div>

        {/* Lista de Reservas */}
        {showReservations && (
          <Card className="mb-8 bg-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <User className="h-5 w-5" />
                Reservas Confirmadas ({Object.keys(reservations).length})
              </CardTitle>
              <CardDescription className="text-gray-200">
                Lista de todas as reservas realizadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(reservations).length === 0 ? (
                <p className="text-gray-300 text-center py-8">
                  Nenhuma reserva realizada ainda
                </p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(reservations).map(([bikeId, data]) => (
                    <div key={bikeId} className="border rounded-lg p-4 bg-gray-50/20 text-white">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="border-blue-400 text-blue-300">Bike {bikeId}</Badge>
                        <Badge variant="secondary" className="flex items-center gap-1 bg-purple-600 text-white">
                          <Shirt className="h-3 w-3" />
                          {data.shirtSize}
                        </Badge>
                      </div>
                      <p className="font-semibold text-white">{data.name}</p>
                      <p className="text-sm text-blue-300">Camiseta: {data.shirtName}</p>
                      <p className="text-sm text-gray-300">{data.timestamp}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Dialog de Reserva */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white border-gray-700">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-white">
                <Bike className="h-5 w-5 text-blue-400" />
                Reservar Bike {selectedBike}
              </DialogTitle>
              <DialogDescription className="text-gray-300">
                Preencha seus dados para confirmar a reserva
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-gray-200">Nome completo</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Digite seu nome completo"
                  disabled={loading}
                  className="bg-gray-700 text-white border-gray-600 placeholder:text-gray-400"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="shirtSize" className="text-gray-200">Tamanho da camiseta</Label>
                <Select 
                  value={formData.shirtSize} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, shirtSize: value }))}
                  disabled={loading}
                >
                  <SelectTrigger className="bg-gray-700 text-white border-gray-600">
                    <SelectValue placeholder="Selecione o tamanho" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 text-white border-gray-600">
                    <SelectItem value="PP">PP</SelectItem>
                    <SelectItem value="P">P</SelectItem>
                    <SelectItem value="M">M</SelectItem>
                    <SelectItem value="G">G</SelectItem>
                    <SelectItem value="GG">GG</SelectItem>
                    <SelectItem value="XGG">XGG</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="shirtName" className="text-gray-200">Nome na camiseta</Label>
                <Input
                  id="shirtName"
                  value={formData.shirtName}
                  onChange={(e) => setFormData(prev => ({ ...prev, shirtName: e.target.value }))}
                  placeholder="Nome que aparecerá na traseira da camiseta"
                  disabled={loading}
                  className="bg-gray-700 text-white border-gray-600 placeholder:text-gray-400"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline"
                onClick={() => setShowDialog(false)}
                disabled={loading}
                className="flex items-center gap-2"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleReservation}
                disabled={loading}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirmar Reserva
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog de Cancelamento */}
        <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white border-gray-700">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-white">
                <XCircle className="h-5 w-5 text-red-400" />
                Cancelar Reserva
              </DialogTitle>
              <DialogDescription className="text-gray-300">
                Digite a senha e o número da bike para cancelar a reserva.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="cancel-password" className="text-gray-200">Senha</Label>
                <Input
                  id="cancel-password"
                  type="password"
                  value={cancelPassword}
                  onChange={(e) => setCancelPassword(e.target.value)}
                  placeholder="Digite a senha"
                  disabled={loading}
                  className="bg-gray-700 text-white border-gray-600 placeholder:text-gray-400"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bike-to-cancel" className="text-gray-200">Número da Bike</Label>
                <Input
                  id="bike-to-cancel"
                  type="number"
                  value={bikeToCancel}
                  onChange={(e) => setBikeToCancel(e.target.value)}
                  placeholder="Digite o número da bike"
                  disabled={loading}
                  className="bg-gray-700 text-white border-gray-600 placeholder:text-gray-400"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline"
                onClick={() => setShowCancelDialog(false)}
                disabled={loading}
                className="flex items-center gap-2"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleCancelReservation}
                disabled={loading}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirmar Cancelamento
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default App

