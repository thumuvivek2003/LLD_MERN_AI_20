import RidesTable from '../../../core/components/tables/RidesTable.jsx';

export default function RideMonitoringList({ rides, onOpen }) {
  return <RidesTable rides={rides} onOpen={onOpen} />;
}
