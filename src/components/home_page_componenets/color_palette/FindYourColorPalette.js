import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FindYourColorPalette.css';

const FindYourColorPalette = () => {
  const navigate = useNavigate();

  const colorCategories = [
    {
      id: 1,
      name: 'Black Dresses & Ball Gowns',
      color: 'black',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI2NyIgdmlld0JveD0iMCAwIDIwMCAyNjciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjY3IiBmaWxsPSIjMDAwMDAwIi8+CjxwYXRoIGQ9Ik0xMDAgNTBMMTIwIDEwMEgxNDBMMTUwIDEzMFYyMDBIMTMwVjIzMEgxMDBWMjMwSDcwVjIwMEg1MFYxMzBMNjAgMTAwSDgwTDEwMCA1MFoiIGZpbGw9IiMyMjIyMjIiLz4KPC9zdmc+'
    },
    {
      id: 2,
      name: 'White Dresses & Ball Gowns',
      color: 'white',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI2NyIgdmlld0JveD0iMCAwIDIwMCAyNjciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjY3IiBmaWxsPSIjRkZGRkZGIiBzdHJva2U9IiNFMEUwRTAiLz4KPHBhdGggZD0iTTEwMCA1MEwxMjAgMTAwSDE0MEwxNTAgMTMwVjIwMEgxMzBWMjMwSDEwMFYyMzBINzBWMjAwSDUwVjEzMEw2MCAxMDBIODBMMTAwIDUwWiIgZmlsbD0iI0Y4RjhGOCIvPgo8L3N2Zz4='
    },
    {
      id: 3,
      name: 'Red Dresses & Ball Gowns',
      color: 'red',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI2NyIgdmlld0JveD0iMCAwIDIwMCAyNjciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjY3IiBmaWxsPSIjREM0MzQ0Ii8+CjxwYXRoIGQ9Ik0xMDAgNTBMMTIwIDEwMEgxNDBMMTUwIDEzMFYyMDBIMTMwVjIzMEgxMDBWMjMwSDcwVjIwMEg1MFYxMzBMNjAgMTAwSDgwTDEwMCA1MFoiIGZpbGw9IiNGRjU1NTUiLz4KPC9zdmc+'
    },
    {
      id: 4,
      name: 'Blue Dresses & Ball Gowns',
      color: 'blue',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI2NyIgdmlld0JveD0iMCAwIDIwMCAyNjciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjY3IiBmaWxsPSIjMzMzM0ZGIi8+CjxwYXRoIGQ9Ik0xMDAgNTBMMTIwIDEwMEgxNDBMMTUwIDEzMFYyMDBIMTMwVjIzMEgxMDBWMjMwSDcwVjIwMEg1MFYxMzBMNjAgMTAwSDgwTDEwMCA1MFoiIGZpbGw9IiM2NjY2RkYiLz4KPC9zdmc+'
    },
    {
      id: 5,
      name: 'Pink Dresses & Ball Gowns',
      color: 'pink',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI2NyIgdmlld0JveD0iMCAwIDIwMCAyNjciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjY3IiBmaWxsPSIjRkY2NkI2Ii8+CjxwYXRoIGQ9Ik0xMDAgNTBMMTIwIDEwMEgxNDBMMTUwIDEzMFYyMDBIMTMwVjIzMEgxMDBWMjMwSDcwVjIwMEg1MFYxMzBMNjAgMTAwSDgwTDEwMCA1MFoiIGZpbGw9IiNGRkI2RDkiLz4KPC9zdmc+'
    },
    {
      id: 6,
      name: 'Gold Dresses & Ball Gowns',
      color: 'gold',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI2NyIgdmlld0JveD0iMCAwIDIwMCAyNjciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjY3IiBmaWxsPSIjRkZENzAwIi8+CjxwYXRoIGQ9Ik0xMDAgNTBMMTIwIDEwMEgxNDBMMTUwIDEzMFYyMDBIMTMwVjIzMEgxMDBWMjMwSDcwVjIwMEg1MFYxMzBMNjAgMTAwSDgwTDEwMCA1MFoiIGZpbGw9IiNGRkU1NTUiLz4KPC9zdmc+'
    }
  ];

  const handleColorClick = (color, colorName) => {
    // Navigate to shop page with color filter
    navigate(`/shop?color=${encodeURIComponent(color)}&colorName=${encodeURIComponent(colorName)}`);
  };

  return (
    <section className="color-palette-section">
      <h2 className="section-title">Find Your Color Palette</h2>
      <div className="color-palette-grid">
        {colorCategories.map(category => (
          <div key={category.id} className="color-item">
            <div 
              className="color-link" 
              onClick={() => handleColorClick(category.color, category.name)}
              style={{ cursor: 'pointer' }}
            >
              <div className="color-image-container">
                <img src={category.image} alt={category.name} className="color-image" />
              </div>
              <p className="color-name">{category.name}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FindYourColorPalette;
