import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth, ROLES, ROLE_LABELS } from '../firebase/AuthContext'
import { useGuests } from '../firebase/useGuests'
import { useSongs } from '../firebase/useSongs'
import { useSiteSettings } from '../firebase/useSiteSettings'
import { collection, getDocs, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../firebase/config'

function AdminTabs({ activeTab, setActiveTab, hasPermission }) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', permission: null },
    { id: 'weddingparty', label: 'Wedding Party', permission: 'manage_wedding_party' },
    { id: 'ourstory', label: 'Our Story', permission: 'edit_content' },
    { id: 'feedback', label: 'Feedback', permission: null },
    { id: 'guests', label: 'Invite List', permission: 'manage_guests' },
    { id: 'users', label: 'Users', permission: 'manage_users' },
    { id: 'songs', label: 'Songs', permission: 'manage_songs' },
    { id: 'rsvps', label: 'RSVPs', permission: 'view_rsvps' },
  ]

  return (
    <div className="flex flex-wrap gap-2 mb-8 border-b border-accent-200 pb-4">
      {tabs.map(tab => {
        if (tab.permission && !hasPermission(tab.permission)) return null
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-primary-600 text-white'
                : 'bg-accent-100 text-accent-700 hover:bg-accent-200'
            }`}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

function Dashboard({ guests, songs, getGuestStats }) {
  const stats = getGuestStats()

  return (
    <div>
      <h2 className="text-2xl font-bold text-accent-800 mb-6">Dashboard</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow border border-accent-100">
          <p className="text-3xl font-bold text-primary-600">{stats.totalAttending}</p>
          <p className="text-accent-600 text-sm">Total Attending</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border border-accent-100">
          <p className="text-3xl font-bold text-green-600">{stats.attending}</p>
          <p className="text-accent-600 text-sm">Confirmed</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border border-accent-100">
          <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
          <p className="text-accent-600 text-sm">Pending</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border border-accent-100">
          <p className="text-3xl font-bold text-red-600">{stats.declined}</p>
          <p className="text-accent-600 text-sm">Declined</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow border border-accent-100">
          <h3 className="font-bold text-accent-800 mb-4">Quick Stats</h3>
          <ul className="space-y-2 text-accent-600">
            <li>Total Guests Invited: {stats.total}</li>
            <li>Plus Ones Attending: {stats.plusOnes}</li>
            <li>Song Requests: {songs.length}</li>
          </ul>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border border-accent-100">
          <h3 className="font-bold text-accent-800 mb-4">Top Song Requests</h3>
          <ul className="space-y-2 text-accent-600">
            {songs.slice(0, 5).map((song, i) => (
              <li key={song.id}>
                {i + 1}. {song.song} {song.artist && `- ${song.artist}`}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function GuestManagement({ guests, addGuest, updateGuest, deleteGuest }) {
  const [showForm, setShowForm] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [importText, setImportText] = useState('')
  const [editingGuest, setEditingGuest] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    plusOne: false,
    plusOneName: '',
    dietaryRestrictions: '',
    tableNumber: '',
    notes: ''
  })

  const handleBulkImport = async () => {
    const lines = importText.trim().split('\n')
    let imported = 0

    for (const line of lines) {
      const parts = line.split(',').map(p => p.trim())
      if (parts[0]) {
        await addGuest({
          name: parts[0],
          email: parts[1] || '',
          phone: parts[2] || '',
          plusOne: parts[3]?.toLowerCase() === 'yes' || parts[3]?.toLowerCase() === 'true',
          plusOneName: '',
          dietaryRestrictions: '',
          tableNumber: '',
          notes: '',
          rsvpStatus: 'pending'
        })
        imported++
      }
    }

    setImportText('')
    setShowImport(false)
    alert(`Imported ${imported} guests!`)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editingGuest) {
      await updateGuest(editingGuest.id, formData)
    } else {
      await addGuest(formData)
    }
    setFormData({
      name: '', email: '', phone: '', plusOne: false,
      plusOneName: '', dietaryRestrictions: '', tableNumber: '', notes: ''
    })
    setShowForm(false)
    setEditingGuest(null)
  }

  const handleEdit = (guest) => {
    setFormData(guest)
    setEditingGuest(guest)
    setShowForm(true)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-accent-800">Invite List</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowImport(!showImport)}
            className="px-4 py-2 bg-accent-100 text-accent-700 rounded-lg hover:bg-accent-200 transition-colors"
          >
            {showImport ? 'Cancel Import' : 'Bulk Import'}
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            {showForm ? 'Cancel' : 'Add Guest'}
          </button>
        </div>
      </div>

      {showImport && (
        <div className="bg-white p-6 rounded-xl shadow border border-accent-100 mb-6">
          <h3 className="font-bold text-accent-800 mb-2">Bulk Import Guests</h3>
          <p className="text-sm text-accent-500 mb-4">
            Paste guest list with one guest per line. Format: Name, Email, Phone, Plus One (yes/no)
          </p>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="John Smith, john@email.com, 555-1234, yes&#10;Jane Doe, jane@email.com, 555-5678, no&#10;Bob Wilson"
            rows={6}
            className="w-full px-4 py-3 border border-accent-200 rounded-lg font-mono text-sm"
          />
          <button
            onClick={handleBulkImport}
            disabled={!importText.trim()}
            className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            Import Guests
          </button>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow border border-accent-100 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Name *"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="px-4 py-2 border border-accent-200 rounded-lg"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="px-4 py-2 border border-accent-200 rounded-lg"
            />
            <input
              type="tel"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="px-4 py-2 border border-accent-200 rounded-lg"
            />
            <input
              type="text"
              placeholder="Table Number"
              value={formData.tableNumber}
              onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
              className="px-4 py-2 border border-accent-200 rounded-lg"
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="plusOne"
                checked={formData.plusOne}
                onChange={(e) => setFormData({ ...formData, plusOne: e.target.checked })}
              />
              <label htmlFor="plusOne">Plus One Allowed</label>
            </div>
            {formData.plusOne && (
              <input
                type="text"
                placeholder="Plus One Name"
                value={formData.plusOneName}
                onChange={(e) => setFormData({ ...formData, plusOneName: e.target.value })}
                className="px-4 py-2 border border-accent-200 rounded-lg"
              />
            )}
            <input
              type="text"
              placeholder="Dietary Restrictions"
              value={formData.dietaryRestrictions}
              onChange={(e) => setFormData({ ...formData, dietaryRestrictions: e.target.value })}
              className="px-4 py-2 border border-accent-200 rounded-lg"
            />
            <input
              type="text"
              placeholder="Notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="px-4 py-2 border border-accent-200 rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            {editingGuest ? 'Update Guest' : 'Add Guest'}
          </button>
        </form>
      )}

      <div className="bg-white rounded-xl shadow border border-accent-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-accent-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-accent-700">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-accent-700">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-accent-700">Plus One</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-accent-700">Table</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-accent-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-accent-100">
            {guests.map(guest => (
              <tr key={guest.id} className="hover:bg-accent-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-accent-800">{guest.name}</p>
                  <p className="text-sm text-accent-500">{guest.email}</p>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={guest.rsvpStatus}
                    onChange={(e) => updateGuest(guest.id, { rsvpStatus: e.target.value })}
                    className={`px-2 py-1 rounded text-sm ${
                      guest.rsvpStatus === 'attending' ? 'bg-green-100 text-green-700' :
                      guest.rsvpStatus === 'declined' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="attending">Attending</option>
                    <option value="declined">Declined</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-accent-600">
                  {guest.plusOne ? (guest.plusOneName || 'Yes') : 'No'}
                </td>
                <td className="px-4 py-3 text-accent-600">{guest.tableNumber || '-'}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleEdit(guest)}
                    className="text-primary-600 hover:text-primary-700 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteGuest(guest.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function UserManagement() {
  const { updateUserRole } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, 'users'))
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      setLoading(false)
    }
    fetchUsers()
  }, [])

  const handleRoleChange = async (userId, newRole) => {
    await updateUserRole(userId, newRole)
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u))
  }

  if (loading) return <p>Loading users...</p>

  return (
    <div>
      <h2 className="text-2xl font-bold text-accent-800 mb-6">User Management</h2>

      <div className="bg-white rounded-xl shadow border border-accent-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-accent-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-accent-700">User</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-accent-700">Email</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-accent-700">Role</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-accent-700">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-accent-100">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-accent-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {user.photoURL && (
                      <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full" />
                    )}
                    <span className="font-medium text-accent-800">{user.displayName}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-accent-600">{user.email}</td>
                <td className="px-4 py-3">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="px-2 py-1 border border-accent-200 rounded"
                  >
                    {Object.entries(ROLE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-accent-500 text-sm">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function RSVPView({ guests, updateGuest }) {
  const respondedGuests = guests.filter(g => g.rsvpStatus !== 'pending')
  const attending = guests.filter(g => g.rsvpStatus === 'attending')
  const declined = guests.filter(g => g.rsvpStatus === 'declined')
  const pending = guests.filter(g => g.rsvpStatus === 'pending')

  return (
    <div>
      <h2 className="text-2xl font-bold text-accent-800 mb-6">RSVP Responses</h2>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-xl border border-green-200 text-center">
          <p className="text-3xl font-bold text-green-600">{attending.length}</p>
          <p className="text-green-700 text-sm">Attending</p>
        </div>
        <div className="bg-red-50 p-4 rounded-xl border border-red-200 text-center">
          <p className="text-3xl font-bold text-red-600">{declined.length}</p>
          <p className="text-red-700 text-sm">Declined</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 text-center">
          <p className="text-3xl font-bold text-yellow-600">{pending.length}</p>
          <p className="text-yellow-700 text-sm">Awaiting</p>
        </div>
      </div>

      {respondedGuests.length === 0 ? (
        <div className="bg-white p-8 rounded-xl border border-accent-100 text-center">
          <p className="text-accent-500">No responses yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Attending */}
          {attending.length > 0 && (
            <div className="bg-white rounded-xl shadow border border-accent-100 overflow-hidden">
              <div className="bg-green-50 px-4 py-3 border-b border-green-200">
                <h3 className="font-bold text-green-800">Attending ({attending.length})</h3>
              </div>
              <div className="divide-y divide-accent-100">
                {attending.map(guest => (
                  <div key={guest.id} className="px-4 py-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-accent-800">{guest.name}</p>
                      {guest.plusOne && guest.plusOneName && (
                        <p className="text-sm text-accent-500">+1: {guest.plusOneName}</p>
                      )}
                      {guest.dietaryRestrictions && (
                        <p className="text-xs text-orange-600">Diet: {guest.dietaryRestrictions}</p>
                      )}
                    </div>
                    <select
                      value={guest.rsvpStatus}
                      onChange={(e) => updateGuest(guest.id, { rsvpStatus: e.target.value })}
                      className="px-2 py-1 rounded text-sm bg-green-100 text-green-700"
                    >
                      <option value="pending">Pending</option>
                      <option value="attending">Attending</option>
                      <option value="declined">Declined</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Declined */}
          {declined.length > 0 && (
            <div className="bg-white rounded-xl shadow border border-accent-100 overflow-hidden">
              <div className="bg-red-50 px-4 py-3 border-b border-red-200">
                <h3 className="font-bold text-red-800">Declined ({declined.length})</h3>
              </div>
              <div className="divide-y divide-accent-100">
                {declined.map(guest => (
                  <div key={guest.id} className="px-4 py-3 flex justify-between items-center">
                    <p className="font-medium text-accent-800">{guest.name}</p>
                    <select
                      value={guest.rsvpStatus}
                      onChange={(e) => updateGuest(guest.id, { rsvpStatus: e.target.value })}
                      className="px-2 py-1 rounded text-sm bg-red-100 text-red-700"
                    >
                      <option value="pending">Pending</option>
                      <option value="attending">Attending</option>
                      <option value="declined">Declined</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function SongManagement({ songs, deleteSong }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-accent-800 mb-6">Song Requests ({songs.length})</h2>

      <div className="space-y-3">
        {songs.map((song, index) => (
          <div
            key={song.id}
            className={`flex items-center gap-4 p-4 bg-white rounded-xl border border-accent-100 ${
              song.brideVote === 'up' || song.groomVote === 'up' ? 'ring-2 ring-green-300' : ''
            } ${
              song.brideVote === 'down' || song.groomVote === 'down' ? 'ring-2 ring-red-300' : ''
            }`}
          >
            <span className="text-2xl font-bold text-accent-300">#{index + 1}</span>
            <div className="flex-1">
              <p className="font-medium text-accent-800">
                {song.song} {song.artist && <span className="text-accent-500">- {song.artist}</span>}
              </p>
              <p className="text-sm text-accent-500">
                Requested by {song.name} | Score: {song.upvotes - song.downvotes}
                {song.brideVote && ` | Bride: ${song.brideVote}`}
                {song.groomVote && ` | Groom: ${song.groomVote}`}
              </p>
            </div>
            <button
              onClick={() => deleteSong(song.id)}
              className="text-red-600 hover:text-red-700 px-3 py-1"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function WeddingPartyBuilder({ settings, updateSettings }) {
  const [party, setParty] = useState(settings.weddingParty || {
    bridesmaids: [],
    groomsmen: []
  })
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)

  // Sync state when settings load from Firestore
  useEffect(() => {
    if (settings.weddingParty) {
      setParty(settings.weddingParty)
    }
  }, [settings.weddingParty])

  const handleSave = async () => {
    setSaving(true)
    await updateSettings({ weddingParty: party })
    setSaving(false)
  }

  const addMember = (side) => {
    const newMember = {
      id: Date.now().toString(),
      name: '',
      role: side === 'bridesmaids' ? 'Bridesmaid' : 'Groomsman',
      email: '',
      bio: '',
      photo: '',
      photoApproved: false
    }
    setParty(prev => ({
      ...prev,
      [side]: [...prev[side], newMember]
    }))
    setEditing({ side, id: newMember.id })
  }

  const updateMember = (side, id, field, value) => {
    setParty(prev => ({
      ...prev,
      [side]: prev[side].map(m => m.id === id ? { ...m, [field]: value } : m)
    }))
  }

  const removeMember = (side, id) => {
    setParty(prev => ({
      ...prev,
      [side]: prev[side].filter(m => m.id !== id)
    }))
    setEditing(null)
  }

  const moveMember = (side, id, direction) => {
    setParty(prev => {
      const list = [...prev[side]]
      const index = list.findIndex(m => m.id === id)
      if (index < 0) return prev
      const newIndex = index + direction
      if (newIndex < 0 || newIndex >= list.length) return prev
      const [item] = list.splice(index, 1)
      list.splice(newIndex, 0, item)
      return { ...prev, [side]: list }
    })
  }

  const roleOptions = {
    bridesmaids: ['Maid of Honor', 'Matron of Honor', 'Bridesmaid', 'Junior Bridesmaid', 'Flower Girl'],
    groomsmen: ['Best Man', 'Groomsman', 'Junior Groomsman', 'Ring Bearer']
  }

  const renderSide = (side, title) => (
    <div className="bg-white p-4 rounded-xl border border-accent-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-accent-700">{title}</h3>
        <button
          onClick={() => addMember(side)}
          className="px-3 py-1 bg-accent-100 text-accent-700 rounded-lg hover:bg-accent-200 text-sm"
        >
          + Add
        </button>
      </div>

      <div className="space-y-3">
        {party[side].map((member, index) => (
          <div key={member.id} className="border border-accent-100 rounded-lg p-3">
            {editing?.side === side && editing?.id === member.id ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={member.name}
                  onChange={(e) => updateMember(side, member.id, 'name', e.target.value)}
                  placeholder="Name"
                  className="w-full px-3 py-2 border border-accent-200 rounded-lg"
                />
                <select
                  value={member.role}
                  onChange={(e) => updateMember(side, member.id, 'role', e.target.value)}
                  className="w-full px-3 py-2 border border-accent-200 rounded-lg"
                >
                  {roleOptions[side].map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                <input
                  type="email"
                  value={member.email}
                  onChange={(e) => updateMember(side, member.id, 'email', e.target.value)}
                  placeholder="Email (for login)"
                  className="w-full px-3 py-2 border border-accent-200 rounded-lg"
                />
                <textarea
                  value={member.bio}
                  onChange={(e) => updateMember(side, member.id, 'bio', e.target.value)}
                  placeholder="Bio / Description"
                  rows={2}
                  className="w-full px-3 py-2 border border-accent-200 rounded-lg"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditing(null)}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm"
                  >
                    Done
                  </button>
                  <button
                    onClick={() => removeMember(side, member.id)}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center text-accent-500 overflow-hidden">
                  {member.photo ? (
                    <img src={member.photo} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span>{member.name?.charAt(0) || '?'}</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-accent-800">{member.name || 'Unnamed'}</p>
                  <p className="text-xs text-accent-500">{member.role}</p>
                </div>
                {member.photoApproved && (
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">Photo OK</span>
                )}
                <div className="flex gap-1">
                  <button onClick={() => moveMember(side, member.id, -1)} className="p-1 text-accent-400 hover:text-accent-600">up</button>
                  <button onClick={() => moveMember(side, member.id, 1)} className="p-1 text-accent-400 hover:text-accent-600">dn</button>
                  <button
                    onClick={() => setEditing({ side, id: member.id })}
                    className="px-2 py-1 text-primary-600 hover:bg-primary-50 rounded text-sm"
                  >
                    Edit
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {party[side].length === 0 && (
          <p className="text-accent-400 text-sm text-center py-4">No {title.toLowerCase()} added yet</p>
        )}
      </div>
    </div>
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-accent-800">Wedding Party Builder</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <p className="text-accent-600 mb-6">
        Add wedding party members here. They can log in with their email to upload their own photo.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {renderSide('bridesmaids', 'Bridesmaids')}
        {renderSide('groomsmen', 'Groomsmen')}
      </div>
    </div>
  )
}

function OurStoryEditor({ settings, updateSettings }) {
  const [timeline, setTimeline] = useState(settings.timeline || [])
  const [funFacts, setFunFacts] = useState(settings.funFacts || [])
  const [pets, setPets] = useState(settings.pets || [])
  const [quotes, setQuotes] = useState(settings.quotes || [])
  const [showDates, setShowDates] = useState(settings.showDates !== false)
  const [editingTimeline, setEditingTimeline] = useState(null)
  const [editingFact, setEditingFact] = useState(null)
  const [editingPet, setEditingPet] = useState(null)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await updateSettings({ timeline, funFacts, pets, quotes, showDates })
    setSaving(false)
  }

  const updateTimelineItem = (index, field, value) => {
    const updated = [...timeline]
    updated[index] = { ...updated[index], [field]: value }
    setTimeline(updated)
  }

  const updateFunFact = (index, field, value) => {
    const updated = [...funFacts]
    updated[index] = { ...updated[index], [field]: value }
    setFunFacts(updated)
  }

  const addTimelineItem = () => {
    setTimeline([...timeline, { year: '', title: '', description: '', icon: '' }])
    setEditingTimeline(timeline.length)
  }

  const removeTimelineItem = (index) => {
    setTimeline(timeline.filter((_, i) => i !== index))
    setEditingTimeline(null)
  }

  const moveTimelineItem = (index, direction) => {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= timeline.length) return
    const updated = [...timeline]
    const [item] = updated.splice(index, 1)
    updated.splice(newIndex, 0, item)
    setTimeline(updated)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-accent-800">Our Story Editor</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Show/Hide Dates Toggle */}
      <div className="bg-white p-4 rounded-xl border border-accent-100 mb-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={showDates}
            onChange={(e) => setShowDates(e.target.checked)}
            className="w-5 h-5 rounded"
          />
          <span className="font-medium text-accent-800">Show dates on timeline</span>
        </label>
        <p className="text-sm text-accent-500 mt-1 ml-8">
          When unchecked, only titles will show (no dates/years)
        </p>
      </div>

      {/* Timeline Editor */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-accent-700">Timeline Events</h3>
          <button
            onClick={addTimelineItem}
            className="px-4 py-2 bg-accent-100 text-accent-700 rounded-lg hover:bg-accent-200"
          >
            + Add Event
          </button>
        </div>

        <div className="space-y-3">
          {timeline.map((item, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-xl border border-accent-100"
            >
              {editingTimeline === index ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={item.icon}
                      onChange={(e) => updateTimelineItem(index, 'icon', e.target.value)}
                      placeholder="Icon (emoji)"
                      className="px-3 py-2 border border-accent-200 rounded-lg text-2xl text-center"
                    />
                    <input
                      type="text"
                      value={item.year}
                      onChange={(e) => updateTimelineItem(index, 'year', e.target.value)}
                      placeholder="Date/Year"
                      className="px-3 py-2 border border-accent-200 rounded-lg"
                    />
                  </div>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateTimelineItem(index, 'title', e.target.value)}
                    placeholder="Title"
                    className="w-full px-3 py-2 border border-accent-200 rounded-lg font-medium"
                  />
                  <textarea
                    value={item.description}
                    onChange={(e) => updateTimelineItem(index, 'description', e.target.value)}
                    placeholder="Description"
                    rows={3}
                    className="w-full px-3 py-2 border border-accent-200 rounded-lg"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingTimeline(null)}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg"
                    >
                      Done
                    </button>
                    <button
                      onClick={() => removeTimelineItem(index)}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{item.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium text-accent-800">{item.title}</p>
                    <p className="text-sm text-accent-500">{item.year}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => moveTimelineItem(index, -1)}
                      disabled={index === 0}
                      className="p-2 text-accent-400 hover:text-accent-600 disabled:opacity-30"
                    >
                      up
                    </button>
                    <button
                      onClick={() => moveTimelineItem(index, 1)}
                      disabled={index === timeline.length - 1}
                      className="p-2 text-accent-400 hover:text-accent-600 disabled:opacity-30"
                    >
                      down
                    </button>
                    <button
                      onClick={() => setEditingTimeline(index)}
                      className="px-3 py-1 text-primary-600 hover:bg-primary-50 rounded"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Fun Facts Editor */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-bold text-accent-700">Fun Facts</h3>
            <p className="text-sm text-accent-500">Compare answers for both of you - feel free to fill in for each other!</p>
          </div>
          <button
            onClick={() => {
              setFunFacts([...funFacts, { emoji: '❓', title: '', hilary: '', bruce: '' }])
              setEditingFact(funFacts.length)
            }}
            className="px-4 py-2 bg-accent-100 text-accent-700 rounded-lg hover:bg-accent-200"
          >
            + Add Fact
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {funFacts.map((fact, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-xl border border-accent-100"
            >
              {editingFact === index ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={fact.emoji}
                      onChange={(e) => updateFunFact(index, 'emoji', e.target.value)}
                      placeholder="Emoji"
                      className="px-3 py-2 border border-accent-200 rounded-lg text-center text-xl"
                    />
                    <input
                      type="text"
                      value={fact.title}
                      onChange={(e) => updateFunFact(index, 'title', e.target.value)}
                      placeholder="Category (e.g., Favorite Food)"
                      className="px-3 py-2 border border-accent-200 rounded-lg"
                    />
                  </div>
                  <div className="bg-pink-50 p-3 rounded-lg border border-pink-200">
                    <label className="block text-xs font-medium text-pink-700 mb-1">
                      👰 Bride's Answer
                    </label>
                    <input
                      type="text"
                      value={fact.hilary}
                      onChange={(e) => updateFunFact(index, 'hilary', e.target.value)}
                      placeholder="What's Bride's answer?"
                      className="w-full px-3 py-2 border border-pink-200 rounded-lg bg-white"
                    />
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <label className="block text-xs font-medium text-blue-700 mb-1">
                      🤵 Groom's Answer
                    </label>
                    <input
                      type="text"
                      value={fact.bruce}
                      onChange={(e) => updateFunFact(index, 'bruce', e.target.value)}
                      placeholder="What's Groom's answer?"
                      className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-white"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingFact(null)}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg"
                    >
                      Done
                    </button>
                    <button
                      onClick={() => {
                        setFunFacts(funFacts.filter((_, i) => i !== index))
                        setEditingFact(null)
                      }}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="cursor-pointer hover:bg-accent-50 -m-4 p-4 rounded-xl"
                  onClick={() => setEditingFact(index)}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{fact.emoji}</span>
                    <span className="font-medium text-accent-800">{fact.title}</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="bg-pink-50 px-2 py-1 rounded text-pink-800">
                      <span className="font-medium">👰 Bride:</span> {fact.hilary || '(not set)'}
                    </p>
                    <p className="bg-blue-50 px-2 py-1 rounded text-blue-800">
                      <span className="font-medium">🤵 Groom:</span> {fact.bruce || '(not set)'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Pets Editor */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-accent-700">Fur Babies</h3>
          <button
            onClick={() => {
              setPets([...pets, { name: '', type: '', personality: '', emoji: '🐾', image: '' }])
              setEditingPet(pets.length)
            }}
            className="px-4 py-2 bg-accent-100 text-accent-700 rounded-lg hover:bg-accent-200"
          >
            + Add Pet
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {pets.map((pet, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-xl border border-accent-100"
            >
              {editingPet === index ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-4 gap-2">
                    <input
                      type="text"
                      value={pet.emoji}
                      onChange={(e) => {
                        const updated = [...pets]
                        updated[index] = { ...updated[index], emoji: e.target.value }
                        setPets(updated)
                      }}
                      placeholder="Emoji"
                      className="px-3 py-2 border border-accent-200 rounded-lg text-center text-xl"
                    />
                    <input
                      type="text"
                      value={pet.name}
                      onChange={(e) => {
                        const updated = [...pets]
                        updated[index] = { ...updated[index], name: e.target.value }
                        setPets(updated)
                      }}
                      placeholder="Name"
                      className="col-span-3 px-3 py-2 border border-accent-200 rounded-lg"
                    />
                  </div>
                  <input
                    type="text"
                    value={pet.type}
                    onChange={(e) => {
                      const updated = [...pets]
                      updated[index] = { ...updated[index], type: e.target.value }
                      setPets(updated)
                    }}
                    placeholder="Type (e.g., Black Cat • 14 years with Bride)"
                    className="w-full px-3 py-2 border border-accent-200 rounded-lg"
                  />
                  <textarea
                    value={pet.personality}
                    onChange={(e) => {
                      const updated = [...pets]
                      updated[index] = { ...updated[index], personality: e.target.value }
                      setPets(updated)
                    }}
                    placeholder="Personality description"
                    rows={2}
                    className="w-full px-3 py-2 border border-accent-200 rounded-lg"
                  />
                  <input
                    type="text"
                    value={pet.image}
                    onChange={(e) => {
                      const updated = [...pets]
                      updated[index] = { ...updated[index], image: e.target.value }
                      setPets(updated)
                    }}
                    placeholder="Image URL (e.g., /photos/pet.jpg)"
                    className="w-full px-3 py-2 border border-accent-200 rounded-lg"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingPet(null)}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg"
                    >
                      Done
                    </button>
                    <button
                      onClick={() => {
                        setPets(pets.filter((_, i) => i !== index))
                        setEditingPet(null)
                      }}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="cursor-pointer hover:bg-accent-50 -m-4 p-4 rounded-xl"
                  onClick={() => setEditingPet(index)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{pet.emoji}</span>
                    <div>
                      <p className="font-medium text-accent-800">{pet.name}</p>
                      <p className="text-sm text-accent-500">{pet.type}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quotes Editor */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-accent-700">Romantic Quotes</h3>
          <button
            onClick={() => setQuotes([...quotes, ''])}
            className="px-4 py-2 bg-accent-100 text-accent-700 rounded-lg hover:bg-accent-200"
          >
            + Add Quote
          </button>
        </div>
        <div className="space-y-3">
          {quotes.map((quote, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-xl border border-accent-100 flex gap-3"
            >
              <span className="text-accent-400 text-xl">"</span>
              <input
                type="text"
                value={quote}
                onChange={(e) => {
                  const updated = [...quotes]
                  updated[index] = e.target.value
                  setQuotes(updated)
                }}
                placeholder="Enter a romantic quote..."
                className="flex-1 px-3 py-2 border border-accent-200 rounded-lg"
              />
              <button
                onClick={() => setQuotes(quotes.filter((_, i) => i !== index))}
                className="text-red-500 hover:text-red-700 px-2"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function FeedbackManagement() {
  const [feedback, setFeedback] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Try to load from Firebase
    try {
      const q = query(collection(db, 'feedback'), orderBy('timestamp', 'desc'))
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const feedbackList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setFeedback(feedbackList)
        setLoading(false)
      }, (error) => {
        console.log('Firebase error, loading from localStorage:', error)
        // Fallback to localStorage
        const local = JSON.parse(localStorage.getItem('allFeedback') || '[]')
        setFeedback(local.map((f, i) => ({ ...f, id: `local-${i}` })).reverse())
        setLoading(false)
      })

      return () => unsubscribe()
    } catch (error) {
      // Fallback to localStorage
      const local = JSON.parse(localStorage.getItem('allFeedback') || '[]')
      setFeedback(local.map((f, i) => ({ ...f, id: `local-${i}` })).reverse())
      setLoading(false)
    }
  }, [])

  const handleDelete = async (id) => {
    if (id.startsWith('local-')) {
      // Delete from localStorage
      const local = JSON.parse(localStorage.getItem('allFeedback') || '[]')
      const index = parseInt(id.replace('local-', ''))
      local.splice(local.length - 1 - index, 1)
      localStorage.setItem('allFeedback', JSON.stringify(local))
      setFeedback(feedback.filter(f => f.id !== id))
    } else {
      // Delete from Firebase
      await deleteDoc(doc(db, 'feedback', id))
    }
  }

  if (loading) return <p className="text-accent-600">Loading feedback...</p>

  return (
    <div>
      <h2 className="text-2xl font-bold text-accent-800 mb-6">
        Feedback ({feedback.length})
      </h2>

      {feedback.length === 0 ? (
        <div className="bg-white p-8 rounded-xl border border-accent-100 text-center">
          <p className="text-accent-500">No feedback yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {feedback.map((item) => (
            <div
              key={item.id}
              className="bg-white p-5 rounded-xl border border-accent-100 shadow-sm"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <p className="text-accent-800 whitespace-pre-wrap">{item.message}</p>
                  <p className="text-xs text-accent-400 mt-3">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                  title="Delete"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Admin() {
  const { user, loading, hasPermission, isAdmin } = useAuth()
  const { guests, addGuest, updateGuest, deleteGuest, getGuestStats } = useGuests()
  const { songs, deleteSong } = useSongs()
  const { settings, updateSettings } = useSiteSettings()
  const [activeTab, setActiveTab] = useState('dashboard')

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-accent-600">Loading...</p>
        <p className="text-xs text-accent-400">Checking authentication status</p>
      </div>
    )
  }

  // Check if user has any admin permissions
  const hasAnyAccess = hasPermission('admin_panel') ||
                       hasPermission('manage_guests') ||
                       hasPermission('view_rsvps') ||
                       hasPermission('manage_songs')

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4 px-4">
        <h1 className="text-2xl font-bold text-accent-800">Admin Panel</h1>
        <p className="text-accent-600 text-center">Please sign in to access the admin panel</p>
        <Link
          to="/login"
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Sign In
        </Link>
      </div>
    )
  }

  if (!hasAnyAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4 px-4">
        <h1 className="text-2xl font-bold text-accent-800">Access Denied</h1>
        <p className="text-accent-600 text-center">You don't have permission to access the admin panel.</p>
        <p className="text-sm text-accent-500">Signed in as: {user.email}</p>
        <Link
          to="/"
          className="px-6 py-3 bg-accent-200 text-accent-700 rounded-lg hover:bg-accent-300 transition-colors"
        >
          Go Home
        </Link>
      </div>
    )
  }

  return (
    <div className="py-8 px-4 bg-gradient-to-b from-accent-50 to-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-accent-800">Admin Panel</h1>
          <div className="flex items-center gap-3">
            {user.photoURL && (
              <img src={user.photoURL} alt="" className="w-10 h-10 rounded-full" />
            )}
            <div>
              <p className="font-medium text-accent-800">{user.displayName}</p>
              <p className="text-xs text-accent-500">{ROLE_LABELS[user.role]}</p>
            </div>
          </div>
        </div>

        <AdminTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          hasPermission={hasPermission}
        />

        {activeTab === 'dashboard' && (
          <Dashboard guests={guests} songs={songs} getGuestStats={getGuestStats} />
        )}
        {activeTab === 'weddingparty' && hasPermission('manage_wedding_party') && (
          <WeddingPartyBuilder settings={settings} updateSettings={updateSettings} />
        )}
        {activeTab === 'ourstory' && hasPermission('edit_content') && (
          <OurStoryEditor settings={settings} updateSettings={updateSettings} />
        )}
        {activeTab === 'feedback' && (
          <FeedbackManagement />
        )}
        {activeTab === 'guests' && hasPermission('manage_guests') && (
          <GuestManagement
            guests={guests}
            addGuest={addGuest}
            updateGuest={updateGuest}
            deleteGuest={deleteGuest}
          />
        )}
        {activeTab === 'users' && hasPermission('manage_users') && (
          <UserManagement />
        )}
        {activeTab === 'songs' && hasPermission('manage_songs') && (
          <SongManagement songs={songs} deleteSong={deleteSong} />
        )}
        {activeTab === 'rsvps' && hasPermission('view_rsvps') && (
          <RSVPView
            guests={guests}
            updateGuest={updateGuest}
          />
        )}
      </div>
    </div>
  )
}

export default Admin
