import React, { useState, useRef, useEffect } from 'react';
import './CaseOpening.css';

const caseItems = [
    { id: 1, name: 'AK-47 | Поверхностная закалка', rarity: 'blue', image: 'https://sun9-75.userapi.com/impf/c840536/v840536925/3f9f7/jjsnaFomcl4.jpg?size=1024x798&quality=96&sign=6064a3a8c9662218be6bd28af770d3b5&c_uniq_tag=m67UoCzpGIsnKH6J6XL9yVXdRydxqM4dyFBXyIb0Knc&type=album' },
    { id: 2, name: 'Glock-18 | Градиент', rarity: 'blue', image: 'https://sun9-78.userapi.com/impf/c841438/v841438306/283a5/q3SaVoIJNrQ.jpg?size=760x593&quality=96&sign=4ad4b7eabb62a9887cc877417f56577e&c_uniq_tag=zKOrj1tJZl46rYjjjT8Um8fJ8ZeEvWZFsQ-F5jJr_lI&type=album' },
    { id: 3, name: 'Knife | *', rarity: 'blue', image: 'https://external-preview.redd.it/ATfGg5i3BwEmD1dHi61Y8YMzmmmVhUEJtwIr0HFmT7o.png?auto=webp&s=cbb665cdd56b60c17ea3dd2a6b59bf728cd5e894' },
    { id: 4, name: 'Phil paulevich', rarity: 'purple', image: 'https://i.ytimg.com/vi/I9Mp1WUxn5c/maxresdefault.jpg' },
    { id: 5, name: 'AWP | Скоростной зверь', rarity: 'purple', image: 'https://i.ytimg.com/vi/EpIxv3VYk3c/maxresdefault.jpg' },
    { id: 6, name: 'Нож-бабочка | Убийство', rarity: 'gold', image: 'https://avatars.mds.yandex.net/i?id=5416c46a1358b11f1d8d9e678cce92fa_sr-5022452-images-thumbs&n=13' },
];
const CaseOpening = () => {
    const [items, setItems] = useState([]);
    const [isSpinning, setIsSpinning] = useState(false);
    const [wonItem, setWonItem] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const itemsTrackRef = useRef(null);
    const containerRef = useRef(null);
    const animationRef = useRef(null);
    const targetIndex = useRef(0);
  
    // Получить случайный предмет с учетом редкости
    const getRandomItem = () => {
      const rand = Math.random();
      if (rand < 0.02) { // 2% шанс на золотой
        const goldItems = caseItems.filter(item => item.rarity === 'gold');
        return goldItems[Math.floor(Math.random() * goldItems.length)];
      } else if (rand < 0.15) { // 13% шанс на фиолетовый
        const purpleItems = caseItems.filter(item => item.rarity === 'purple');
        return purpleItems[Math.floor(Math.random() * purpleItems.length)];
      } else { // 85% шанс на синий
        const blueItems = caseItems.filter(item => item.rarity === 'blue');
        return blueItems[Math.floor(Math.random() * blueItems.length)];
      }
    };
  
    // Генерация дорожки с предметами
    const generateItems = () => {
      const itemsCount = 100; // Общее количество предметов в дорожке
      const itemsArray = Array(itemsCount).fill(null).map(() => getRandomItem());
      
      // Определяем позицию выигрышного предмета (последние 30%)
      targetIndex.current = Math.floor(itemsCount * 0.7) + Math.floor(Math.random() * 15);
      const winningItem = getRandomItem();
      itemsArray[targetIndex.current] = winningItem;
      setWonItem(winningItem);
      
      return itemsArray;
    };
  
    // Запуск анимации прокрутки
    const startSpin = () => {
      if (isSpinning) return;
      
      setItems(generateItems());
      setShowResult(false);
      setIsSpinning(true);
      
      const itemWidth = 100; // Ширина одного предмета в пикселях
      const targetPosition = targetIndex.current * itemWidth - containerRef.current.offsetWidth / 2 + itemWidth / 2;
      
      let startTime = null;
      const duration = 6000; // 4 секунды анимации
      
      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Эффект замедления (ease-out)
        const easing = 1 - Math.pow(1 - progress, 4);
        const newPosition = easing * targetPosition;
        
        itemsTrackRef.current.style.transform = `translateX(-${newPosition}px)`;
        
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          // Точная финальная позиция
          itemsTrackRef.current.style.transform = `translateX(-${targetPosition}px)`;
          setIsSpinning(false);
          setShowResult(true);
        }
      };
      
      animationRef.current = requestAnimationFrame(animate);
    };
  
    // Очистка анимации при размонтировании
    useEffect(() => {
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, []);
  
    return (
      <div className="case-container">
        <h1>Case-battle</h1>
        
        <div className="case-content">
          {showResult ? (
            <div className={`result-window ${wonItem.rarity}`}>
              <img src={wonItem.image} alt={wonItem.name} />
              <h2>{wonItem.name}</h2>
              <button onClick={() => setShowResult(false)}>Открыть еще кейс</button>
            </div>
          ) : (
            <>
              <div className="items-container" ref={containerRef}>
                <div className="items-track" ref={itemsTrackRef}>
                  {items.map((item, index) => (
                    <div key={index} className={`case-item ${item?.rarity || 'blue'}`}>
                      <img src={item?.image} alt={item?.name} />
                    </div>
                  ))}
                </div>
                <div className="indicator-arrow"></div>
              </div>
              <button onClick={startSpin} disabled={isSpinning}>
                {isSpinning ? 'Открывается...' : 'Открыть кейс'}
              </button>
            </>
          )}
        </div>
      </div>
    );
  };
  
  export default CaseOpening;