import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { collection, addDoc, updateDoc, doc, onSnapshot, query, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import imageCompression from 'browser-image-compression';
import { db, storage } from '../firebase';
import './ContentCalendar.css';

const ContentCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // Form states
  const [editTitle, setEditTitle] = useState('');
  const [editLink, setEditLink] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editImage, setEditImage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'calendar_events'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEvents(eventData);
    });
    return () => unsubscribe();
  }, []);

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
  const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  const openModal = (dateStr, event = null) => {
    setSelectedDate(dateStr);
    if (event) {
      setSelectedEvent(event);
      setEditTitle(event.title || '');
      setEditLink(event.link || '');
      setEditDesc(event.description || '');
      setEditImage(event.imageUrl || '');
    } else {
      setSelectedEvent(null);
      setEditTitle('');
      setEditLink('');
      setEditDesc('');
      setEditImage('');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const saveEvent = async () => {
    if (!editTitle.trim()) return;

    const eventData = {
      title: editTitle,
      link: editLink,
      description: editDesc,
      imageUrl: editImage,
      date: selectedDate, // Format YYYY-MM-DD
    };

    try {
      if (selectedEvent) {
        await updateDoc(doc(db, 'calendar_events', selectedEvent.id), eventData);
      } else {
        await addDoc(collection(db, 'calendar_events'), {
          ...eventData,
          createdAt: serverTimestamp()
        });
      }
      closeModal();
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Compress image before upload
      const options = {
        maxSizeMB: 0.3,
        maxWidthOrHeight: 1280,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);

      const storageRef = ref(storage, `calendar_images/${Date.now()}_${compressedFile.name}`);
      await uploadBytes(storageRef, compressedFile);
      const url = await getDownloadURL(storageRef);
      setEditImage(url);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Lỗi khi tải ảnh lên!");
    } finally {
      setIsUploading(false);
    }
  };

  const renderCells = () => {
    const cells = [];
    
    // Empty cells for previous month
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="calendar-cell empty"></div>);
    }
    
    // Days of current month
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isToday = dateStr === new Date().toISOString().split('T')[0];
      
      const dayEvents = events.filter(e => e.date === dateStr);
      
      cells.push(
        <div key={d} className={`calendar-cell ${isToday ? 'today' : ''}`} onClick={() => openModal(dateStr)}>
          <div className="cell-header">
            <span className="cell-day">{d}</span>
            <button className="add-event-btn"><Plus size={14} /></button>
          </div>
          <div className="cell-events">
            {dayEvents.map(ev => (
              <div 
                key={ev.id} 
                className="event-pill" 
                onClick={(e) => {
                  e.stopPropagation();
                  openModal(dateStr, ev);
                }}
              >
                {ev.title}
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    // Fill remaining cells for a complete grid (up to 42 cells)
    const totalCells = cells.length;
    for (let i = totalCells; i < 42; i++) {
      cells.push(<div key={`empty-end-${i}`} className="calendar-cell empty"></div>);
    }
    
    return cells;
  };

  return (
    <div className="content-calendar animate-fade-in">
      <div className="calendar-header">
        <h2 className="page-title">{monthNames[month]} {year}</h2>
        <div className="calendar-actions">
          <button className="btn-outline" onClick={goToToday}>Hôm nay</button>
          <div className="nav-buttons">
            <button className="icon-btn-small" onClick={prevMonth}><ChevronLeft size={20} /></button>
            <button className="icon-btn-small" onClick={nextMonth}><ChevronRight size={20} /></button>
          </div>
        </div>
      </div>
      
      <div className="calendar-grid">
        <div className="calendar-days-header">
          {dayNames.map(d => <div key={d} className="day-name">{d}</div>)}
        </div>
        <div className="calendar-body">
          {renderCells()}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content glass-effect" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedEvent ? 'Chi tiết Video' : 'Lên lịch Video mới'}</h3>
              <button className="close-btn" onClick={closeModal}>&times;</button>
            </div>
            <div className="modal-body">
              <input 
                type="text" 
                className="modal-input-title" 
                value={editTitle} 
                onChange={e => setEditTitle(e.target.value)}
                placeholder="Tiêu đề video" 
                autoFocus
              />
              
              <div className="modal-section">
                <label>Link tham khảo</label>
                <div className="input-group">
                  <LinkIcon size={18} className="input-icon" />
                  <input 
                    type="text" 
                    className="modal-input" 
                    value={editLink}
                    onChange={e => setEditLink(e.target.value)}
                    placeholder="https://..." 
                  />
                </div>
              </div>

              <div className="modal-section">
                <label>Mô tả chi tiết</label>
                <textarea 
                  className="modal-textarea" 
                  value={editDesc}
                  onChange={e => setEditDesc(e.target.value)}
                  placeholder="Nội dung kịch bản..."
                ></textarea>
              </div>
              
              <div className="modal-section">
                <label>Ảnh đính kèm</label>
                {editImage ? (
                  <div style={{position: 'relative', marginTop: '8px'}}>
                    <img src={editImage} alt="Preview" style={{width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px'}} />
                    <button 
                      onClick={() => setEditImage('')}
                      style={{position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer'}}
                    >
                      Xóa ảnh
                    </button>
                  </div>
                ) : (
                  <label className="upload-area" style={{cursor: isUploading ? 'not-allowed' : 'pointer', opacity: isUploading ? 0.5 : 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                    <input type="file" accept="image/*" style={{display: 'none'}} onChange={handleImageUpload} disabled={isUploading} />
                    <ImageIcon size={32} className="upload-icon" />
                    <span>{isUploading ? 'Đang tải lên...' : 'Click để tải ảnh lên'}</span>
                  </label>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-outline" onClick={closeModal}>Hủy</button>
              <button className="btn-primary" onClick={saveEvent}>Lưu lịch</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentCalendar;
