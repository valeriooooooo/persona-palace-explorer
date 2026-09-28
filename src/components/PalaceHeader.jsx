import ImageSlot from './ui/ImageSlot'

export default function PalaceHeader({ palace }) {
  const [first, ...rest] = palace.name.split(' ')

  return (
    <header className="palace-header">
      <div className="title-card" data-anim="title">
        <h1 className="title-card__name">
          <span className="title-card__line title-card__line--big">{first}</span>
          <span className="title-card__line">{rest.join(' ')}</span>
        </h1>
        <p className="title-card__tag">{palace.subtitle}</p>
      </div>

      <p className="palace-header__desc" data-anim="desc">
        {palace.description}
      </p>

      <div className="ruler" data-anim="ruler">
        <ImageSlot className="ruler__portrait" src={palace.portrait} alt={palace.ruler} position={palace.portraitPosition} />
        <dl className="ruler__card">
          <div>
            <dt>Palace Ruler</dt>
            <dd>{palace.ruler}</dd>
          </div>
          <div>
            <dt>Sin</dt>
            <dd>{palace.sin}</dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>{palace.location}</dd>
          </div>
        </dl>
      </div>
    </header>
  )
}
