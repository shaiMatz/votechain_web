import React, { createContext, useState } from 'react';

export const ElectionContext = createContext();

export const ElectionProvider = ({ children }) => {
  const [elections, setElections] = useState([
    {
      id: 1,
      name: 'General Election 2024',
      startdate: '2024-11-04',
      enddate: '2024-11-06',
      candidates: ['Candidate A', 'Candidate B'],
      isended: false,
    },
    {
      id: 2,
      name: 'Local Election 2024',
      startdate: '2024-05-01',
      enddate: '2024-05-03',
      candidates: ['Candidate X', 'Candidate Y'],
      isended: false,
    },
    {
      id: 3,
      name: 'Past Election 2023',
      startdate: '2023-01-01',
      enddate: '2023-01-03',
      candidates: ['Candidate 1', 'Candidate 2'],
      isended: false,
    },
    {
      id: 4,
      name: 'Past Election 2022',
      startdate: '2022-02-01',
      enddate: '2022-02-03',
      candidates: ['Candidate Alpha', 'Candidate Beta'],
      isended: false,
    },
    {
      id: 5,
      name: 'Past Election 2021',
      startdate: '2021-03-01',
      enddate: '2021-03-03',
      candidates: ['Candidate X', 'Candidate Y'],
      isended: true,
    },
    {
      id: 6,
      name: 'Past Election 2020',
      startdate: '2020-04-01',
      enddate: '2020-04-03',
      candidates: ['Candidate A', 'Candidate B'],
      isended: false,
    }
  ]);

  return (
    <ElectionContext.Provider value={{ elections, setElections }}>
      {children}
    </ElectionContext.Provider>
  );
};
